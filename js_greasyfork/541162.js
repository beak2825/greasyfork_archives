// ==UserScript==
// @name         GitHub info on Typst Universe
// @name:zh-CN   在 Typst Universe 上显示 GitHub 信息
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Display information about the GitHub repository on typst.app/universe
// @description:zh-CN 在 typst.app/universe 上显示 GitHub 仓库的信息
// @author       Y.D.X.
// @match        https://typst.app/universe/package/*
// @icon         https://simpleicons.org/icons/typst.svg
// @license      MIT
// @supportURL   https://gist.github.com/YDX-2147483647/48d1169d35101cde9e2b20aff178da22
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM.setValue
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/541162/GitHub%20info%20on%20Typst%20Universe.user.js
// @updateURL https://update.greasyfork.org/scripts/541162/GitHub%20info%20on%20Typst%20Universe.meta.js
// ==/UserScript==
;(async function () {
  "use strict"

  /**
   * @typedef RepoMeta
   * @property {string} owner
   * @property {string} name
   */

  /**
   * @typedef RepoInfo
   * @property {number} forkCount
   * @property {number} stargazerCount
   * @property {Date} pushedAt
   * @property {{ totalCount: number }} openIssues
   * @property {{ totalCount: number }} allIssues
   * @property {number} downloadCount
   * @property {number} contributorCount
   */

  class RepoMetaUtil {
    /**
     * @param {string} owner_name
     * @returns {RepoMeta | null}
     */
    static parse(owner_name) {
      const split = owner_name.indexOf("/")
      if (!split) {
        return null
      }
      return {
        owner: owner_name.slice(0, split),
        name: owner_name.slice(split + 1),
      }
    }

    /**
     * @param {RepoMeta} meta
     * @returns {string}
     */
    static stringify(meta) {
      return `${meta.owner}/${meta.name}`
    }
  }

  class RepoInfoCache {
    /**
     * @param {RepoMeta} meta
     * @returns {Promise<RepoInfo | null>}
     */
    static async get(meta) {
      /** @type {Record<string, { updatedAt: string, info: RepoInfo }>} */
      const cache = JSON.parse(await GM.getValue("CACHE", "{}"))

      const now = new Date()

      // Drop outdated entries
      const valid_cache = Object.fromEntries(
        Object.entries(cache).filter(([k, v]) => {
          const updatedAt = new Date(v.updatedAt)
          return updatedAt >= now - 7 * 24 * 60 * 60 * 1000 // 1 week
        }),
      )
      await GM.setValue("CACHE", JSON.stringify(valid_cache))

      const key = RepoMetaUtil.stringify(meta)
      const cached = valid_cache[key]?.info
      if (cached) {
        // Convert pushedAt from string to Date
        if (typeof cached.pushedAt === "string") {
          cached.pushedAt = new Date(cached.pushedAt)
        }
        return cached
      }
      return null
    }
    /**
     * @param {RepoMeta} meta
     * @param {RepoInfo} info
     * @returns {Promise<void>}
     */
    static async set(meta, info) {
      /** @type {Record<string, { updatedAt: string, info: RepoInfo }>} */
      const cache = JSON.parse(await GM.getValue("CACHE", "{}"))

      const key = RepoMetaUtil.stringify(meta)
      cache[key] = {
        updatedAt: new Date().toISOString(),
        info,
      }
      await GM.setValue("CACHE", JSON.stringify(cache))
    }
  }

  /**
   * Locates the GitHub repository link in the Typst Universe package page.
   * @returns {{ element: HTMLAnchorElement, meta: RepoMeta } | null}
   * Return null if not found.
   */
  function locate_repo_link() {
    const dl = document.querySelector("#about dl")
    if (dl === null) {
      return null
    }

    for (const dt of dl.querySelectorAll(":scope > dt")) {
      if (dt.textContent === "Repository:") {
        const dd = dt.nextElementSibling
        if (dd.tagName !== "DD") {
          continue
        }
        /** @type {HTMLAnchorElement | null} */
        const anchor = dd.querySelector(":scope > a")
        if (anchor === null || !anchor.href.startsWith("https://github.com/")) {
          continue
        }

        const owner_name = remove_suffix(
          anchor.href.slice("https://github.com/".length),
          ".git",
        )
        const meta = RepoMetaUtil.parse(owner_name)
        if (meta === null) {
          continue
        }

        return { element: anchor, meta }
      }
    }

    return null
  }

  /**
   * Fetches and builds a container element with GitHub repository information.
   * @param {RepoMeta} meta
   * @param {RepoInfo} info
   * @returns {Promise<HTMLSpanElement>}
   */
  async function render_repo({ owner, name }, info) {
    const openIssuesRatio = info.allIssues.totalCount > 0
      ? (info.openIssues.totalCount / info.allIssues.totalCount)
      : 0

    const entry = (title, icon, value, url = null) => {
      const body = `${icon} ${value}`
      const attrs = `title="${title}" style="display: inline-block;"`

      return url === null
        ? `<span ${attrs}>${body}</span>`
        : `<a href="https://github.com/${owner}/${name}${url}" ${attrs}>${body}</a>`
    }

    const container = document.createElement("span")
    // Inspired by https://github.com/best-of-lists/
    container.innerHTML = "(" + [
      entry("stars", "⭐", info.stargazerCount, "/stargazers"),
      entry(
        "contributors",
        "👩‍💻",
        info.contributorCount,
        "/contributors",
      ),
      entry("forks", "🔀", info.forkCount, "/forks"),
      info.downloadCount > 0
        ? entry(
          "downloads of all releases",
          "📥",
          info.downloadCount,
          "/releases/",
        )
        : null,
      entry(
        "issues",
        "📋",
        `${info.allIssues.totalCount} - ${
          (openIssuesRatio * 100).toFixed(0)
        }% open`,
        "/issues/",
      ),
      entry(
        "last pushed at",
        "⏱️",
        `<time datetime="${info.pushedAt.toISOString()}">${info.pushedAt.toLocaleDateString()}</time>`,
      ),
    ].filter((it) => it !== null).join(" · ") + ")"

    return container
  }

  /**
   * Fetches all data of a repo from GitHub.
   * @param {RepoMeta} meta
   * @param {string} token
   * @returns {Promise<RepoInfo>}
   */
  async function fetch_repo_info({ owner, name }, token) {
    const [{ repo }, contributors] = await Promise.all([
      fetch_GitHub_GraphQL(
        `
        query($owner: String!, $name: String!) {
          repo: repository(owner: $owner, name: $name) {
            forkCount
            stargazerCount
            pushedAt
            openIssues: issues(states: [OPEN]) { totalCount }
            allIssues: issues(states: [OPEN, CLOSED]) { totalCount }
            releases(last: 100) {
              nodes {
                releaseAssets(first: 100) { totalCount }
              }
            }
          }
        }`,
        { owner, name },
        token,
      ),
      fetch_repo_contributor_count({ owner, name }, token),
    ])
    const { releases, pushedAt, ...others } = repo
    return {
      downloadCount: sum(
        releases.nodes.map((release) => release.releaseAssets.totalCount),
      ),
      pushedAt: new Date(pushedAt),
      ...others,
      contributorCount: contributors,
    }
  }

  /**
   * Fetches all data of a repo from GitHub with cache.
   * @param {RepoMeta} meta
   * @param {string} token
   * @returns {Promise<RepoInfo>}
   */
  async function fetch_repo_info_cached(meta, token) {
    const cached = await RepoInfoCache.get(meta)
    if (cached) {
      return cached
    }

    const latest = await fetch_repo_info(meta, token)
    await RepoInfoCache.set(meta, latest)
    return latest
  }

  /**
   * Performs a GM_xmlhttpRequest wrapped in a Promise.
   * @param {string} url
   * @param {object} [options={}] The request options (method, headers, body).
   * @returns {Promise<any>}
   */
  function GM_fetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: options.method ?? "GET",
        url,
        headers: options.headers ?? {},
        data: options.body,
        onload: resolve,
        onerror: reject,
      })
    })
  }

  /**
   * Fetches data from the GitHub GraphQL API.
   * @param {string} query - The GraphQL query string.
   * @param {Record<string, string>} variables - The variables for the query.
   * @param {string} token
   * @returns {Promise<any>} The `data` returned from the API.
   * @throws {Error} If the HTTP status is not 200 or if the API returns errors.
   */
  async function fetch_GitHub_GraphQL(query, variables, token) {
    const response = await GM_fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    })
    if (response.status !== 200) {
      throw new Error("HTTP error " + response.status)
    }
    const data = JSON.parse(response.responseText)
    if (data.errors) {
      throw new Error("GitHub GraphQL error " + JSON.stringify(data.errors))
    }
    return data.data
  }

  /**
   * Fetches the total number of contributors for a given GitHub repository using the REST API.
   * @param {RepoMeta} meta
   * @param {string} token
   * @returns {Promise<number>} The total number of contributors.
   */
  async function fetch_repo_contributor_count({ owner, name }, token) {
    // GraphQL API does not have this entry. Resort to REST API.
    const response = await GM_fetch(
      `https://api.github.com/repos/${owner}/${name}/contributors?page=1&per_page=1&anon=True`,
      {
        headers: { "Authorization": "token " + token },
      },
    )

    /** @type {Map<string, string>} */
    const headers = new Map(
      response.responseHeaders.trim().split(/[\r\n]+/).map((line) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders#examples
        const parts = line.split(": ", 2)
        const header = parts.shift()
        const value = parts.join(": ")
        return [header, value]
      }),
    )
    const contributors = parseInt(
      headers.get("link")?.match(/\?page=(\d+)&[^>]+>; rel="last"/)?.at(1) ??
        "0",
    )
    return contributors
  }

  /**
   * Sums the values in an array.
   * @param {number[]} arr - The array of numbers.
   * @returns {number} The sum of the array elements.
   */
  function sum(arr) {
    return arr.reduce((total, current) => total + current, 0)
  }

  /**
   * Remove the suffix if it exists.
   * @param {string} str
   * @param {string} suffix
   * @returns {string}
   */
  function remove_suffix(str, suffix) {
    if (suffix && str.endsWith(suffix)) {
      return str.slice(0, -suffix.length)
    }
    return str
  }

  /**
   * Builds a button for setting or resetting the GitHub token.
   * @returns {HTMLButtonElement}
   */
  function build_token_button() {
    const button = document.createElement("button")
    button.textContent = "🔑"
    button.title = "Set/reset GitHub token"
    button.ariaLabel = button.title
    button.style.margin = "4px"
    button.style.padding = "4px"
    return button
  }

  const match = locate_repo_link()

  if (match !== null) {
    const { element, meta } = match

    let info = null
    try {
      const token = await GM.getValue("GITHUB_TOKEN", "")
      info = await fetch_repo_info_cached(meta, token)
    } catch (error) {
      console.error(error)
    }
    const succeeded = info !== null

    if (succeeded) {
      const annotation = await render_repo(meta, info)
      element.parentElement.appendChild(annotation)
    }

    const token_button = element.parentElement.appendChild(build_token_button())
    token_button.onclick = async () => {
      const token = prompt(
        [
          "🔑 Set/reset your GitHub token",
          "",
          "This script fetches data from GitHub. Setting a token will increase the rate limit of GitHub API.",
          "",
          "You can generate a new token here (no OAuth scopes are required):",
          "https://github.com/settings/tokens/new?description=Typst%20Universe%20GitHub%20Info&default_expires_at=none",
          "",
          "Leave blank to remove the token.",
        ].join("\n"),
        await GM.getValue("GITHUB_TOKEN", ""),
      )

      if (token !== null) {
        await GM.setValue("GITHUB_TOKEN", token)

        // Retry with the new token
        if (!succeeded) {
          info = await fetch_repo_info_cached(meta, token)
          const annotation = await render_repo(meta, info)
          token_button.insertAdjacentElement("beforebegin", annotation)
        }
      }
    }
  }
})()
