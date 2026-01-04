// ==UserScript==
// @name         Force google language to browser's language & disable google safe search
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Force google to use browser's language (avoiding IP-country related results). This helps when living in a country using a foreign language.
// @author       kenshin.rorona
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @run-at       document-start
// @license      MIT
// credit: https://greasyfork.org/en/scripts/25286-google-disable-safesearch-automatically
// @downloadURL https://update.greasyfork.org/scripts/470436/Force%20google%20language%20to%20browser%27s%20language%20%20disable%20google%20safe%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/470436/Force%20google%20language%20to%20browser%27s%20language%20%20disable%20google%20safe%20search.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.isMobile = function () {
        let check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };
    window.addEventListener('load', function () {
        var url = window.location.href;
        var regionalLang = window.navigator.language;
        var language = (new Intl.Locale(regionalLang)).language;
        var params = ["hl=", "safe=off", "lr="];
        for (var param of params) {
            if (url.indexOf(param) == -1) {
                url += `&${param}`;
                if (param.indexOf("hl=") != -1) {
                    url += language;
                } else if (param.indexOf("lr=") != -1) {
                    url += `lang_${language}`;
                }
            }
        }

        var switchLang = language;
        if (url.indexOf(`hl=${language}`) != -1) {
            switchLang = "default"
        }
        let top = 4;
        if (window.isMobile()) {
            top = 10;
        }
        let left = 65;
        const switchBtn = document.createElement("button");
        switchBtn.innerHTML = `Switch to ${switchLang}`;
        switchBtn.style.height = 'auto';
        switchBtn.style.objectFit = 'contain';
        var uiProps = 'background-color: #073276;border-radius: 8px;border-style: none;box-sizing: border-box;color: #FFFFFF;cursor: pointer;display: inline-block;font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;font-size: 14px;font-weight: 500;height: 40px;line-height: 20px;list-style: none;margin: 0;outline: none;padding: 13px 16px;text-align: center;text-decoration: none;transition: color 100ms;vertical-align: baseline;user-select: none;-webkit-user-select: none;touch-action: manipulation;'
        switchBtn.style.cssText = `position:absolute;z-index:100;z-index:99999;top:${top}%;left:${left}%;${uiProps}`;
        switchBtn.addEventListener("click", function () {
            if (url.indexOf(`hl=${language}`) != -1) {
                // switch to default
                url = url.replace(`hl=${language}`, "hl=");
                url = url.replace(`lr=lang_${language}`, "lr=");
            } else {
                // switch to browser lang
                url = url.replace("hl=", `hl=${language}`);
                url = url.replace("lr=", `lr=lang_${language}`);
            }
            document.location.replace(url);
        });
        document.body.prepend(switchBtn);
        if (url != window.location.href) {
            document.location.replace(url);
        }
    });
})();