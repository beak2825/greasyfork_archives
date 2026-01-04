// ==UserScript==
// @name         GitHub Fork Default
// @namespace    https://github.com/logiclrd/GitHubForkDefault/
// @version      2025-08-01
// @description  Allow GitHub forks to be configured to default to self for pull request base
// @author       You
// @match        *://*/*
// @icon         https://github.com/logiclrd/GitHubForkDefault/blob/main/PRIcon.png?raw=true
// @license      MIT
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.getTab
// @grant        GM.saveTab
// @downloadURL https://update.greasyfork.org/scripts/544320/GitHub%20Fork%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/544320/GitHub%20Fork%20Default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var config =
        {
            DefaultToSelfRepos: [""]
        };

    async function updateConfig(defaultToSelfReposStr)
    {
        try
        {
            config.DefaultToSelfRepos = defaultToSelfReposStr.split(/ ,\n/g).filter(i => i);
            await GM.setValue("DefaultToSelfRepos", JSON.stringify(config.DefaultToSelfRepos));
        }
        catch { }
    }

    try
    {
        config.DefaultToSelfRepos = JSON.parse(GM_getValue("DefaultToSelfRepos", "[]"));
    }
    catch { }

    var gmc =
        new GM_config(
        {
            "id": "GitHubPRDefaults",
            "title": "GitHub PR Defaults",
            "css":
            {
                "basic": "width: 75%; height: 25%;"
            },
            "fields":
            {
                "DefaultToSelfRepos":
                {
                    "section": "List of repositories that should default to self for pull requests",
                    "label": "Default-to-Self Repos (one per line and/or comma-separated)",
                    "type": "textarea",
                    "rows": 15,
                    "cols": 60,
                    "default": "myusername/myreponame..."
                }
            },
            "events":
            {
                "init": function() { this.set("DefaultToSelfRepos", config.DefaultToSelfRepos.join('\n')); },
                "save":
                    function()
                    {
                        updateConfig(this.get("DefaultToSelfRepos"));
                        window.location.reload();
                    }
            }
        });

    var tabData = {};

    function pullComponent(path, separator)
    {
        var index = path.indexOf(separator);

        if (index >= 0)
            return [path.substring(0, index), path.substring(index + separator.length).trimStart(separator)];
        else
            return [path, ''];
    }

    function isValidOwnerName(name) { return /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(name); }
    function isValidRepoName(name) { return /[a-z\d.-_]+/i.test(name); }
    function isValidBranchName(name)
    {
        return (
            new RegExp("^(?!/|.*(?:[/.]\\.|//|@\\{|\\\\))[^\\040\\177 ~^:?*[]+(?<!\\.lock)(?<![/.])$").test(name) &&
            !/[0-9a-f]{40}/i.test(name) && // GitHub-specific
            !name.startsWith("refs/")); // GitHub-specific
    }

    function decodePullRequestURL(url)
    {
        if (url.host != "github.com")
            return null;

        var path = url.pathname.replace(/^\/+/g, '');

        var baseOwner, baseRepo, operation, baseBranch, headOwner, headRepo, headBranch;

        [baseOwner, path] = pullComponent(path, '/');
        [baseRepo, path] = pullComponent(path, '/');
        [operation, path] = pullComponent(path, '/');
        [baseBranch, path] = pullComponent(path, '...');
        [headOwner, path] = pullComponent(path, ':');

        if (path.indexOf(':') < 0)
            [headRepo, headBranch, path] = [baseRepo, path, ''];
        else
        {
            [headRepo, path] = pullComponent(path, ':');
            [headBranch, path] = [path, ''];
        }

        if (operation !== "compare")
            return null;
        if (!isValidOwnerName(baseOwner) || !isValidRepoName(baseRepo) || !isValidBranchName(baseBranch))
            return null;
        if (!isValidOwnerName(headOwner) || !isValidRepoName(headRepo) || !isValidBranchName(headBranch))
            return null;

        var decoded =
            {
                Base:
                {
                    Owner: baseOwner,
                    Repo: baseRepo,
                    Branch: baseBranch
                },
                Head:
                {
                    Owner: headOwner,
                    Repo: headRepo,
                    Branch: headBranch
                },
                Params: url.search
            };

        return decoded;
    }

    function encodePullRequestURL(pr)
    {
        return `https://github.com/${pr.Base.Owner}/${pr.Base.Repo}/compare/${pr.Base.Branch}...${pr.Head.Owner}:${pr.Head.Repo}:${pr.Head.Branch}${pr.Params}`;
    }

    function isPullRequestURL(url)
    {
        return decodePullRequestURL(url) != null;
    }

    function isBadPullRequestURL(url)
    {
        var pr = decodePullRequestURL(url);

        if (pr == null)
            return false;

        var baseRepoQualifiedName = pr.Base.Owner + '/' + pr.Base.Repo;
        var headRepoQualifiedName = pr.Head.Owner + '/' + pr.Head.Repo;

        if (!config.DefaultToSelfRepos.includes(headRepoQualifiedName))
            return false;

        return baseRepoQualifiedName !== headRepoQualifiedName;
    }

    function isGoodPullRequestURL(url)
    {
        var pr = decodePullRequestURL(url);

        if (pr == null)
            return false;

        var baseRepoQualifiedName = pr.Base.Owner + '/' + pr.Base.Repo;
        var headRepoQualifiedName = pr.Head.Owner + '/' + pr.Head.Repo;

        if (!config.DefaultToSelfRepos.includes(headRepoQualifiedName))
            return false;

        return baseRepoQualifiedName === headRepoQualifiedName;
    }

    function convertBadToGood(url)
    {
        var pr = decodePullRequestURL(url);

        if (pr == null)
            return url;

        pr.Base.Owner = pr.Head.Owner;
        pr.Base.Repo = pr.Head.Repo;

        return encodePullRequestURL(pr);
    }

    async function check()
    {
        // https://github.com/schismtracker/schismtracker/compare/master...logiclrd:schismtracker:test-pr-thinger?expand=1
        var urlRaw = window.location.href;
        var url = URL.parse(urlRaw);

        var tabData = await GM.getTab();

        if (!("LastURL" in tabData))
            tabData.LastURL = "about:";

        var lastURL = URL.parse(tabData.LastURL);

        tabData.LastURL = urlRaw;

        await GM.saveTab(tabData);

        if (isPullRequestURL(url))
        {
            var configButton = document.createElement("button");

            configButton.className = "btn Button--small";
            configButton.innerText = "Configure Base Defaults";
            configButton.onclick = () => gmc.open();

            var panelCandidates = document.getElementsByClassName("range-editor");

            if (panelCandidates.length < 1)
                alert("Couldn't insert configuration button: can't find range editor");
            else
            {
                var panel = panelCandidates[0];

                panel.appendChild(configButton);
            }
        }

        if (isBadPullRequestURL(url) && !isGoodPullRequestURL(lastURL))
            window.location.href = convertBadToGood(url);
    }

    window.addEventListener("load", check);

    var originalPushState = window.history.pushState;

    window.history.pushState =
        function ()
        {
            originalPushState.apply(window.history, arguments);
            setTimeout(check, 10);
        };
})();
