// ==UserScript==
// @name               ViewOnYP
// @name:de            ViewOnYP
// @name:en            ViewOnYP
// @namespace          sun/userscripts
// @version            2.20.3-modified
// @description        Links various membership platforms to Kemono and Coomer.
// @description:de     Vernetzt verschiedene Mitgliedschaftsplattformen mit Kemono und Coomer.
// @description:en     Links various membership platforms to Kemono and Coomer.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            *://afdian.net/a/*
// @include            *://boosty.to/*
// @include            *://candfans.jp/*
// @include            *://discord.com/channels/*
// @include            *://discord.com/invite/*
// @include            *://www.dlsite.com/*/circle/profile/=/maker_id/*
// @include            *://*.fanbox.cc/
// @include            *://www.fanbox.cc/@*
// @include            *://fansly.com/*
// @include            *://fantia.jp/fanclubs/*
// @include            *://*.gumroad.com/
// @include            *://onlyfans.com/*
// @include            *://www.patreon.com/*
// @include            *://www.subscribestar.com/*
// @include            *://subscribestar.adult/*
// @match              *://afdian.net/a/*
// @match              *://boosty.to/*
// @match              *://candfans.jp/*
// @match              *://discord.com/channels/*
// @match              *://discord.com/invite/*
// @match              *://www.dlsite.com/*/circle/profile/=/maker_id/*
// @match              *://*.fanbox.cc/
// @match              *://www.fanbox.cc/@*
// @match              *://fansly.com/*
// @match              *://fantia.jp/fanclubs/*
// @match              *://*.gumroad.com/
// @match              *://onlyfans.com/*
// @match              *://www.patreon.com/*
// @match              *://www.subscribestar.com/*
// @match              *://subscribestar.adult/*
// @exclude            *://boosty.to/app
// @exclude            *://boosty.to/app/*
// @exclude            *://candfans.jp/
// @exclude            *://candfans.jp/auth/*
// @exclude            *://www.fanbox.cc/
// @exclude            *://fansly.com/
// @exclude            *://fansly.com/application
// @exclude            *://fansly.com/dmca
// @exclude            *://fansly.com/explore/*
// @exclude            *://fansly.com/privacy
// @exclude            *://fansly.com/tos
// @exclude            *://fansly.com/usc2257
// @exclude            *://gumroad.com/
// @exclude            *://onlyfans.com/
// @exclude            *://onlyfans.com/about
// @exclude            *://onlyfans.com/antitraffickingstatement
// @exclude            *://onlyfans.com/brand
// @exclude            *://onlyfans.com/contact
// @exclude            *://onlyfans.com/contract
// @exclude            *://onlyfans.com/cookies
// @exclude            *://onlyfans.com/dmca
// @exclude            *://onlyfans.com/help
// @exclude            *://onlyfans.com/help/*
// @exclude            *://onlyfans.com/legalguide/
// @exclude            *://onlyfans.com/legalinquiry
// @exclude            *://onlyfans.com/privacy
// @exclude            *://onlyfans.com/terms
// @exclude            *://onlyfans.com/transparency-center
// @exclude            *://onlyfans.com/transparency-center/*
// @exclude            *://onlyfans.com/usc2257
// @exclude            *://www.patreon.com/
// @exclude            *://www.patreon.com/about
// @exclude            *://www.patreon.com/apps
// @exclude            *://www.patreon.com/brand
// @exclude            *://www.patreon.com/careers
// @exclude            *://www.patreon.com/create
// @exclude            *://www.patreon.com/creators/*
// @exclude            *://www.patreon.com/de-DE
// @exclude            *://www.patreon.com/de-DE/*
// @exclude            *://www.patreon.com/en-GB
// @exclude            *://www.patreon.com/en-GB/*
// @exclude            *://www.patreon.com/es-ES
// @exclude            *://www.patreon.com/es-ES/*
// @exclude            *://www.patreon.com/forgot-password
// @exclude            *://www.patreon.com/fr-FR
// @exclude            *://www.patreon.com/fr-FR/*
// @exclude            *://www.patreon.com/home
// @exclude            *://www.patreon.com/it-IT
// @exclude            *://www.patreon.com/it-IT/*
// @exclude            *://www.patreon.com/login
// @exclude            *://www.patreon.com/messages?*
// @exclude            *://www.patreon.com/mobile
// @exclude            *://www.patreon.com/notifications?*
// @exclude            *://www.patreon.com/policy
// @exclude            *://www.patreon.com/policy/*
// @exclude            *://www.patreon.com/press
// @exclude            *://www.patreon.com/pricing
// @exclude            *://www.patreon.com/product/*
// @exclude            *://www.patreon.com/search
// @exclude            *://www.patreon.com/search?*
// @exclude            *://www.patreon.com/settings/*
// @exclude            *://www.subscribestar.com/
// @exclude            *://www.subscribestar.com/about
// @exclude            *://www.subscribestar.com/api
// @exclude            *://www.subscribestar.com/brand
// @exclude            *://www.subscribestar.com/contacts
// @exclude            *://www.subscribestar.com/dropp
// @exclude            *://www.subscribestar.com/features
// @exclude            *://www.subscribestar.com/guidelines
// @exclude            *://www.subscribestar.com/help
// @exclude            *://www.subscribestar.com/login
// @exclude            *://www.subscribestar.com/posts/*
// @exclude            *://www.subscribestar.com/pricing
// @exclude            *://www.subscribestar.com/privacy
// @exclude            *://www.subscribestar.com/refund
// @exclude            *://www.subscribestar.com/search
// @exclude            *://www.subscribestar.com/search?*
// @exclude            *://www.subscribestar.com/signup
// @exclude            *://www.subscribestar.com/stars
// @exclude            *://www.subscribestar.com/stars?*
// @exclude            *://www.subscribestar.com/taxes
// @exclude            *://www.subscribestar.com/tos
// @exclude            *://subscribestar.adult/
// @exclude            *://subscribestar.adult/about
// @exclude            *://subscribestar.adult/api
// @exclude            *://subscribestar.adult/brand
// @exclude            *://subscribestar.adult/contacts
// @exclude            *://subscribestar.adult/dropp
// @exclude            *://subscribestar.adult/features
// @exclude            *://subscribestar.adult/guidelines
// @exclude            *://subscribestar.adult/help
// @exclude            *://subscribestar.adult/login
// @exclude            *://subscribestar.adult/posts/*
// @exclude            *://subscribestar.adult/pricing
// @exclude            *://subscribestar.adult/privacy
// @exclude            *://subscribestar.adult/refund
// @exclude            *://subscribestar.adult/search
// @exclude            *://subscribestar.adult/search?*
// @exclude            *://subscribestar.adult/signup
// @exclude            *://subscribestar.adult/stars
// @exclude            *://subscribestar.adult/stars?*
// @exclude            *://subscribestar.adult/taxes
// @exclude            *://subscribestar.adult/tos
// @connect            coomer.st
// @connect            kemono.cr
// @connect            nekohouse.su
// @connect            afdian.net
// @connect            api.fanbox.cc
// @connect            apiv3.fansly.com
// @connect            discord.com
// @run-at             document-end
// @inject-into        auto
// @grant              GM.addStyle
// @grant              GM_addStyle
// @grant              GM.deleteValue
// @grant              GM_deleteValue
// @grant              GM.getValue
// @grant              GM_getValue
// @grant              GM.registerMenuCommand
// @grant              GM_registerMenuCommand
// @grant              GM.setValue
// @grant              GM_setValue
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/ViewOnYP.ico
// @copyright          2020-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/546113/ViewOnYP.user.js
// @updateURL https://update.greasyfork.org/scripts/546113/ViewOnYP.meta.js
// ==/UserScript==

(async () => {
  if (!(await GM.getValue("cache2"))) await GM.setValue("cache2", {});
  const cache = await GM.getValue("cache2");

  if (await GM.getValue("cache")) {
    cache.Kemono = await GM.getValue("cache");
    await GM.deleteValue("cache");
  }

  if (await GM.getValue("style")) await GM.deleteValue("style");

  const sites = [
    {
      name: "Coomer",
      check: {
        url: "https://coomer.st/api/v1/creators",
        headers: {
          Accept: "text/css",
        },
      },
      cache: (response, x) => {
        for (const y of JSON.parse(response.responseText)) {
          if (!cache[x.name]) cache[x.name] = {};
          if (!cache[x.name][y.service]) cache[x.name][y.service] = [];
          cache[x.name][y.service].push(y.id);
        }
        return cache;
      },
      get: (response, host, user) => {
        return Boolean(
          JSON.parse(response.responseText)
            .filter((x) => x.service === host)
            .filter((x) => x.id === user).length,
        );
      },
      profile: "https://coomer.st/$HOST/user/$USER",
    },
    {
      name: "Kemono",
      check: {
        url: "https://kemono.cr/api/v1/creators",
        headers: {
          Accept: "text/css",
        },
      },
      cache: (response, x) => {
        for (const y of JSON.parse(response.responseText)) {
          if (!cache[x.name]) cache[x.name] = {};
          if (!cache[x.name][y.service]) cache[x.name][y.service] = [];
          cache[x.name][y.service].push(y.id);
        }
        return cache;
      },
      get: (response, host, user) => {
        return Boolean(
          JSON.parse(response.responseText)
            .filter((x) => x.service === host)
            .filter((x) => x.id === user).length,
        );
      },
      profile: "https://kemono.cr/$HOST/user/$USER",
    },
    {
      name: "Nekohouse",
      check: {
        url: "https://nekohouse.su/api/creators",
      },
      cache: (response, x) => {
        for (const y of JSON.parse(response.responseText)) {
          if (!cache[x.name]) cache[x.name] = {};
          if (!cache[x.name][y.service]) cache[x.name][y.service] = [];
          cache[x.name][y.service].push(y.user_id);
        }
        return cache;
      },
      get: (response, host, user) => {
        return Boolean(
          JSON.parse(response.responseText)
            .filter((x) => x.service === host)
            .filter((x) => x.user_id === user).length,
        );
      },
      profile: "https://nekohouse.su/$HOST/user/$USER",
    },
  ];
  GM.registerMenuCommand("Populate cache", () => {
    for (const x of sites) {
      GM.xmlHttpRequest({
        ...x.check,
        method: "GET",
        onload: async (response) => {
          const cache = x.cache(response, x);
          await GM.setValue("cache2", cache);
          alert(`Populated cache for ${x.name}.`);
        },
      });
    }
  });

  GM.registerMenuCommand("Clear cache", () => {
    GM.deleteValue("cache2").then(alert("Cache cleared successfully."));
  });
  GM.addStyle(`
    #voyp {
      background: light-dark(white, black);
      color: light-dark(black, white);
      position: fixed;
      bottom: 25px;
      right: 25px;
      border-radius: 5px;
      padding: 25px;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.302), 0 1px 3px 1px rgba(60, 64, 67, 0.149);
      text-align: left;
      z-index: 9999;
    }
    #voyp div {
      font-size: small;
      text-transform: uppercase;
      opacity: 0.5;
      text-align: center;
    }
    #voyp div i {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.5em;
      padding: 0.375em 0.5em;
      cursor: pointer;
    }
  `);
  document
    .getElementsByTagName("body")[0]
    .insertAdjacentHTML(
      "beforeend",
      '<div id="voyp"><div><b>ViewOnYP</b><i>✕</i></div><span><br>Querying platforms, please wait...</span></div>',
    );
  document.querySelector("#voyp div i").addEventListener("click", () => {
    document.getElementById("voyp").style.display = "none";
  });

  const host = window.location.hostname.split(".").slice(-2, -1)[0];
  if (!host) return;

  const p = new Promise((resolve, _reject) => {
    switch (host) {
      case "afdian":
        GM.xmlHttpRequest({
          url: `https://afdian.net/api/user/get-profile-by-slug?url_slug=${document.location.pathname.split("/")[2]}`,
          onload: (response) =>
            resolve(JSON.parse(response.responseText).data.user.user_id),
        });
        break;
      case "candfans":
        resolve(
          new URL(
            document
              .querySelector("meta[property='og:image']")
              .getAttribute("content"),
          ).pathname.split("/")[2],
        );
        break;
      case "discord":
        switch (document.location.pathname.split("/")[1]) {
          case "channels":
            resolve(document.location.pathname.split("/")[2]);
            break;
          case "invite":
            GM.xmlHttpRequest({
              url: `https://discord.com/api/v10/invites/${document.location.pathname.split("/")[2]}`,
              onload: (response) => {
                resolve(JSON.parse(response.responseText).guild.id);
              },
            });
            break;
        }
        break;
      case "dlsite":
        resolve(document.location.pathname.split("/")[6]);
        break;
      case "fanbox": {
        let creatorId = document.location.hostname.split(".").slice(-3, -2)[0];
        if (creatorId === "www")
          creatorId = window.location.pathname.split("/")[1].slice(1);
        GM.xmlHttpRequest({
          url: `https://api.fanbox.cc/creator.get?creatorId=${creatorId}`,
          headers: { Origin: "https://fanbox.cc" },
          onload: (response) => {
            try {
              resolve(JSON.parse(response.responseText).body.user.userId);
            } catch {
              resolve(
                new URL(
                  JSON.parse(
                    document.querySelector("script[type='application/ld+json']")
                      .textContent,
                  )[0].image,
                ).pathname.split("/")[7],
              );
            }
          },
        });
        break;
      }
      case "fansly": {
        GM.xmlHttpRequest({
          url: `https://apiv3.fansly.com/api/v1/account?usernames=${document.location.pathname.split("/")[1]}`,
          onload: (response) =>
            resolve(JSON.parse(response.responseText).response[0].id),
        });
        break;
      }
      case "fantia":
        if (document.location.pathname.split("/")[1] === "fanclubs") {
          resolve(document.location.pathname.split("/")[2]);
        } else {
          resolve(
            document
              .querySelector(".fanclub-header a")
              .getAttribute("href")
              .split("/")[2],
          );
        }
        break;
      case "gumroad":
        resolve([
          document.location.hostname.split(".")[0],
          JSON.parse(
            document.getElementsByClassName("js-react-on-rails-component")[0]
              .textContent,
          ).creator_profile.external_id,
        ]);
        break;
      case "patreon":
        window.addEventListener("load", () => {
          const { pageBootstrap } = JSON.parse(
            document.getElementById("__NEXT_DATA__").textContent,
          ).props.pageProps.bootstrapEnvelope;
          resolve(
            pageBootstrap.campaign.data.relationships.creator?.data.id ||
              pageBootstrap.post?.data.relationships.user.data.id,
          );
        });
        break;
      case "boosty":
      case "onlyfans":
      case "subscribestar":
        resolve(document.location.pathname.split("/")[1]);
        break;
    }
  });

  p.then((u) => {
    let users = u;
    if (!Array.isArray(users)) users = [users];

    for (const user of users) {
      for (const x of sites) {
        if (
          cache[x.name] &&
          cache[x.name][host] &&
          cache[x.name][host].includes(user)
        )
          return show(x, host, user, true);
        GM.xmlHttpRequest({
          ...x.check,
          method: "GET",
          onload: (response) => {
            if (x.get(response, host, user)) {
              show(x, host, user, true);
            } else {
              show(x, host, user, false);
            }
          },
        });
      }
    }
  });
  function show(site, host, user, success) {
    const name = site.name;
    const url = site.profile.replace("$HOST", host).replace("$USER", user);

    document.getElementById("voyp").getElementsByTagName("span")[0]?.remove();
    document
      .getElementById("voyp")
      .insertAdjacentHTML(
        "beforeend",
        `<br><b>${name}:</b> ${
          success
            ? `<a href="${url}">${url}</a>`
            : `User ${user} not found in platform's database.`
        }`,
      );
    if (!success) return;

    if (!cache[site.name]) cache[site.name] = {};
    if (!cache[site.name][host]) cache[site.name][host] = [];
    if (!cache[site.name][host].includes(user))
      cache[site.name][host].push(user);
    GM.setValue("cache2", cache);
  }
})();