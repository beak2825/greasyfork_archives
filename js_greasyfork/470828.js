// ==UserScript==
// @name         Go to kemono.su
// @name:ja      kemono.suへ移動
// @namespace    https://greasyfork.org/ja/users/1126644-s-k-script
// @version      0.2.2
// @description  Go to the corresponding kemono.su page from an artist's page. Supports Patreon, Pixiv, Fanbox and Fantia
// @description:ja  アーティストのページから対応するkemono.suのページへ移動します。Pixiv, Fanbox, Fantia, Patreonをサポートしています。
// @author       S.K.Script
// @homepage     https://gitler.moe/skscript/redirect2kemono
// @license      GPL-3.0-only
// @match        https://fantia.jp/*
// @match        https://*.fanbox.cc/*
// @match        https://www.pixiv.net/*
// @match        https://www.patreon.com/*
// @match        https://kemono.su/*
// @match        https://kemono.party/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.su
// @grant        none
// @run-at context-menu
// @downloadURL https://update.greasyfork.org/scripts/470828/Go%20to%20kemonosu.user.js
// @updateURL https://update.greasyfork.org/scripts/470828/Go%20to%20kemonosu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class FantiaUrl {
        static check(href) {
            return !!href.match(/^https:\/\/fantia.jp/i);
        }

        constructor(href) {
            this.href = href;
        }

        extract_metadata() {
            const re = /https:\/\/fantia.jp\/fanclubs\/(?<userid>\d+)/i;
            const match = this.href.match(re);
            if(match) {
                return {ok: match.groups.userid};
            }
            else {
                let result = undefined;
                document.querySelectorAll(".fanclub-name > a").forEach(element => {
                    console.log(element, element.href);
                    const match = element.href.match(re);
                    if(match) {
                        result = {ok: match.groups.userid};
                    }
                });
                if (result) { return result };
                return {err: 'Try again in the top page of this fanclub.\nファンクラブのトップページに移動してからもう一度実行してください'};
            }
        }

        generate_kemono_url(user_id) {
            return 'https://kemono.su/fantia/user/' + user_id;
        }
    }

    class FanboxUrl {
        static check(href) {
            return !!href.match(/^https:\/\/\w+.fanbox.cc/i);
        }

        constructor(href) {
            this.href = href;
        }

        extract_metadata() {
            return {err: 'Try again in the Pixiv user page of this person. Note: Pixiv and Fanbox are run by the same company.\nこの人のPixiv(Fanboxではなく)のユーザーページへ移動してからもう一度実行してください'};
        }

        generate_kemono_url(user_id) {
            return 'https://kemono.su/fanbox/user/' + user_id;
        }
    }

    class PixivUrl {
        static check(href) {
            return !!href.match(/https:\/\/www.pixiv.net/i);
        }

        constructor(href) {
            this.href = href;
        }

        extract_metadata() {
            const re = /https:\/\/www.pixiv.net\/users\/(?<userid>\d+)/i;
            const match = href.match(re);
            if(match) {
                return {ok: match.groups.userid};
            }
            else {
                return {err: 'Try again in the Pixiv user page of this person.\nPixivのユーザーページに移動してからもう一度実行してください'};
            }
        }

        generate_kemono_url(user_id) {
            return 'https://kemono.su/fanbox/user/' + user_id;
        }
    }

    class PatreonUrl {
        static check(href) {
            return !!href.match(/https:\/\/www.patreon.com/i);
        }

        constructor(href) {
            this.href = href;
        }

        extract_metadata() {
            // https://www.patreon.com/user?u=35870453
            const re = /https:\/\/www.patreon.com\/user\?u=(?<userid>\d+)/i;
            const match = href.match(re);
            if(match) {
                return {ok: match.groups.userid};
            }
            else {
                return {err: 'Try again in the Patreon user page of this person.\nPatreonのユーザーページに移動してからもう一度実行してください'};
            }
        }

        generate_kemono_url(user_id) {
            return 'https://kemono.su/patreon/user/' + user_id;
        }
    }

    class KemonoUrl {
        static check(href) {
            return !!href.match(/https:\/\/kemono.(su|party)/i);
        }

        constructor(href) {
            this.href = href;
        }

        extract_metadata() {
            const re = /https:\/\/kemono.(su|party)\/(?<platform>\w+)\/user\/(?<userid>\d+)/i;
            const match = href.match(re);
            if(match) {
                return {ok: {userid: match.groups.userid, platform: match.groups.platform}};
            }
            else {
                return {err: '?'};
            }
        }

        generate_kemono_url(metadata) {
            return 'https://kemono.su/' + metadata.platform + '/user/' + metadata.userid;
        }
    }

    const href = location.href;

    let url;
    if(FantiaUrl.check(href)) {
        url = new FantiaUrl(href);
    }
    else if(FanboxUrl.check(href)) {
        url = new FanboxUrl(href);
    }
    else if(PixivUrl.check(href)) {
        url = new PixivUrl(href);
    }
    else if(PatreonUrl.check(href)) {
        url = new PatreonUrl(href);
    }
    else if(KemonoUrl.check(href)) {
        url = new KemonoUrl(href);
    }
    else {
        url = undefined;
    }

    if(!url) {
        window.alert('Not supported / 未対応/非対応です');
        return;
    }

    const result = url.extract_metadata();
    if(result.ok) {
        const metadata = result.ok;
        const kemono_url = url.generate_kemono_url(metadata);
        window.open(kemono_url, '_blank');
    }
    else {
        const err_message = result.err ? result.err : 'Error / なんかエラーだって';
        window.alert(err_message);
    }

})();