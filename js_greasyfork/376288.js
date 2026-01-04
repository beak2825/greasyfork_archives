// ==UserScript==
// @name            Mastodon Show act users in /@xxx/12345
// @namespace       https://rinsuki.net
// @version         0.3.2
// @description     Mastodonの投稿詳細画面でBT/favしたユーザー一覧を見れるようにする
// @author          rinsuki
// @include         /^https:\/\/[^/]*\/@[A-Za-z0-9_]+\/[0-9]+([?#].*)?$/
// @exclude-match   https://*/@*/*/embed
// @exclude-match   https://*.tiktok.com/*
// @contributionURL https://rinsuki.fanbox.cc/
// @contributionURL https://github.com/sponsors/rinsuki
// @homepageURL     https://github.com/rinsuki/userscripts
// @supportURL      https://github.com/rinsuki/userscripts/issues
// @require         https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js#sha256-2Unxw2h67a3O2shSYYZfKbF80nOZfn9rK/xTsvnUxN0=,sha512-QVs8Lo43F9lSuBykadDb0oSXDL/BbZ588urWVCRwSIoewQv/Ewg1f84mK3U790bZ0FfhFa1YSQUmIhG+pIRKeg==
// @require         https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js#sha256-NfT5dPSyvNRNpzljNH+JUuNB+DkJ5EmCJ9Tia5j2bw0=,sha512-6a1107rTlA4gYpgHAqbwLAtxmWipBdJFcq8y5S/aTge3Bp+VAklABm2LO+Kg51vOWR9JMZq1Ovjl5tpluNpTeQ==
// @downloadURL https://update.greasyfork.org/scripts/376288/Mastodon%20Show%20act%20users%20in%20%40xxx12345.user.js
// @updateURL https://update.greasyfork.org/scripts/376288/Mastodon%20Show%20act%20users%20in%20%40xxx12345.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const User = ({ user }) => {
        return React.createElement("div", { style: { backgroundColor: "#282c37", marginBottom: 1, display: "flex" } },
            React.createElement("a", { href: user.url, style: { padding: 10, display: "flex", textDecoration: "none" } },
                React.createElement("img", { src: user.avatar_static, style: { width: 36, height: 36, paddingRight: 10 } }),
                React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column" } },
                    React.createElement("bdi", { style: { flex: 1, color: "#ffffff" } }, user.display_name),
                    React.createElement("span", { style: { flex: 1, color: "#ffffff9f" } },
                        "@",
                        user.acct))));
    };

    const List = ({ type, statusId }) => {
        const [loading, setLoading] = React.useState(false);
        const [users, setUsers] = React.useState([]);
        const [error, setError] = React.useState(undefined);
        React.useEffect(() => ((async () => {
            setLoading(true);
            try {
                const res = await fetch(`${location.origin}/api/v1/statuses/${statusId}/${type === "favourite" ? "favourited_by" : "reblogged_by"}`);
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    const error = json.error;
                    if (error)
                        throw new Error(`API: ${error}`);
                    setError(undefined);
                    setUsers(json);
                }
                catch (e) {
                    throw new Error(`HTTP ${res.status} ${res.statusText} - ${text}`);
                }
            }
            catch (e) {
                console.log(e);
                setError(e);
            }
            finally {
                setLoading(false);
            }
        })(), undefined), []);
        const centeringStyle = {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: "30px 15px"
        };
        if (error) {
            return React.createElement("div", { style: centeringStyle },
                React.createElement("span", { style: { color: "hsl(0, 100%, 60%)", whiteSpace: "pre-wrap" } }, error != null && typeof error === "object" && "stack" in error && typeof error.stack === "string" && error.stack));
        }
        else if (loading) {
            return React.createElement("div", { style: centeringStyle },
                React.createElement("span", null, "Loading..."));
        }
        else {
            return React.createElement("div", null, users.map(user => React.createElement(User, { user: user, key: user.id })));
        }
    };

    const SectionHeader = ({ icon, name }) => {
        return React.createElement("div", { style: {
                backgroundColor: document.body.style.backgroundColor || "#17191f",
                fontSize: 16,
                padding: 15,
                color: "white",
            } },
            React.createElement("i", { className: `fa fa-${icon}`, style: { marginRight: 5 } }),
            name);
    };

    (function () {
        // Mastodonかどうかを確かめる
        const regex = /^\/@[A-Za-z0-9_]+\/(\d+)/;
        const matchedUrl = regex.exec(location.pathname);
        if (matchedUrl == null)
            return; // URLがそれっぽくない
        // これログインしてるとひっかかることに気づいたので無効化
        // if (document.querySelector('a[href="https://joinmastodon.org/#getting-started"]') == null) return // Mastodonっぽくなさそう
        if (document.querySelector('a[href^="/interact/"]') == null)
            return; // 新しいMastodonを使え
        const statusId = matchedUrl[1];
        const statusMetaDiv = document.querySelector(".detailed-status__meta");
        if (statusMetaDiv == null)
            return; // UIを出すところがないので帰る
        const boostButton = parent(document.querySelector('a[href^="/interact/"][href*="type=reblog"] > .detailed-status__reblogs'));
        const favButton = parent(document.querySelector('a[href^="/interact/"] > .detailed-status__favorites'));
        const isNicoru = favButton && favButton.querySelector(".fa-nicoru--status");
        // ReactでUIを作る
        const Root = () => {
            const [active, setActive] = React.useState(undefined);
            React.useEffect(() => {
                if (boostButton) {
                    boostButton.addEventListener("click", e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActive("reblog");
                    });
                }
                if (favButton) {
                    favButton.addEventListener("click", e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActive("favourite");
                    });
                }
            }, []);
            if (active == null)
                return React.createElement("div", null,
                    React.createElement("i", { className: "fa fa-retweet" }),
                    " か ",
                    isNicoru ? React.createElement("i", { className: "fa fa-nicoru--status" }) : React.createElement("i", { className: "fa fa-star" }),
                    " をクリックするとブーストした/ふぁぼったユーザーが表示されます");
            const [name, icon] = {
                "favourite": isNicoru ? ["ニコる", "nicoru"] : ["ふぁぼ", "star"],
                "reblog": ["ブースト", "retweet"]
            }[active];
            return React.createElement("div", { style: { margin: "15px -15px -15px" } },
                React.createElement(SectionHeader, { icon: icon, name: name }),
                React.createElement("div", null,
                    React.createElement(List, { type: active, key: active, statusId: statusId })),
                React.createElement(SectionHeader, { icon: "reply", name: "返信" }));
        };
        function parent(dom) {
            if (dom == null)
                return dom;
            return dom.parentElement;
        }
        // Reactをマウント
        const myDiv = document.createElement("div");
        ReactDOM.render(React.createElement(Root, null), myDiv);
        statusMetaDiv.appendChild(myDiv);
    })();

})();
