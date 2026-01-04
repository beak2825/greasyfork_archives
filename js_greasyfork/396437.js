// ==UserScript==
// @run-at document-start
// @name         Playok Backgammon Auto-Roll
// @namespace    http://tampermonkey.net/
// @version      0.90
// @description  Auto pass and auto roll for playok.com backgammon game
// @author       Crowo
// @match        https://www.playok.com/*/backgammon/
// @match        https://www.playok.com/tr/tavla/
// @match        https://www.playok.com/el/tavli/
// @match        https://www.playok.com/ro/table/
// @match        https://www.playok.com/bg/tabla/
// @match        https://www.kurnik.pl/tryktrak/
// @match        https://www.playok.com/et/triktrakk/
// @match        https://www.playok.com/lv/bekgemons/
// @match        https://www.playok.com/sq/lojetavelle/
// @match        https://www.playok.com/ru/nardy/
// @match        https://www.playok.com/lt/nardai/
// @match        https://www.playok.com/pt/gamao/
// @match        https://www.playok.com/hu/triktrak
// @match        https://www.playok.com/cs/vrhcaby//

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396437/Playok%20Backgammon%20Auto-Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/396437/Playok%20Backgammon%20Auto-Roll.meta.js
// ==/UserScript==

(function setupAutoRoll() {
    'use strict';
    var btnStart = document.getElementsByClassName("lbprm")[0];
    if(btnStart) {
        window.name = "bg";
        btnStart.click();
        return;
    }
    window.onload = null;


    function removeScript(){
        const scriptTag = document.querySelector('script[src*="bg.js"]');

        if (!scriptTag)
            return false;
        var scriptSrc = scriptTag.src;
        scriptTag.remove();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", scriptTag.src);
        xhr.onreadystatechange = function () {
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var script = xhr.responseText;
                var ix = script.lastIndexOf("for(a=this.fa.length-1;0<=a;a--)");
                if(ix > -1) {
                    script = script.substring(0, ix) + "calcPips(this.fa);" + script.substring(ix);
                    //eval(script);
                    var elm = document.createElement("script");
                    elm.innerHTML = script;
                    document.body.appendChild(elm);
                    var html = document.documentElement.outerHtml;
                    //var html = new XMLSerializer().serializeToString(document);
                    document.open();
                    document.write(html);
                    document.close();
                    document.body.removeChild(document.body.firstChild);

                    try{
                        k2start();
                    }
                    catch(err){
                        alert("smt wrong");
                        setTimeout(function retry(){
                            try{
                                k2start();
                            }
                            catch(err){
                                setTimeout(retry, 100);
                            }
                        }, 100);
                    }
                }
            }
        };
        xhr.send();
        return true;
    }
    if(!removeScript())
        new MutationObserver((_, observer) => {
            if(removeScript())
                observer.disconnect();
        }).observe(document.documentElement, { childList: true, subtree: true });


    var dialogs = document.getElementsByClassName("ctpan");
    if(dialogs.length != 3){
        setTimeout(setupAutoRoll, 100);
        return;
    }

    window.calcPips = function(ua){
        window.ua = ua;
        var pip1 = 0;
        var pip2 = 0;
        var num;
        for(var i = 0; i < ua.length; i++){
            if(ua[i].color > 1 || (num = ua[i].x) < 1)
                continue;
            if(num == 7)
                num = 0;
            else if(num == 20)
                num = 25;
            else if(num < 7){
            }
            else if(num < 20)
                num--;
            else
                num -= 2;
            if(ua[i].color == 0)
                pip1 += num;
            else
                pip2 += (25 - num);
        }
        if(pip1Div){
            pip1Div.innerText = "PIP#1: " + pip1;
            pip2Div.innerText = "PIP#2: " + pip2;
        }
    };

    var css = document.createElement("style");
    css.innerText = '.modal {display: none;position: fixed;z-index: 9999;left: 0;top: 0;width: 100%;height: 100%;overflow: auto;background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);} .modal-content {background-color: #fefefe;margin: 15% auto;padding: 20px;border: 1px solid #888;width: 80%;}';
    document.body.appendChild(css);
    var modal = document.createElement("div");
    modal.className = "modal";
    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    window.addEventListener("click", function(e){if(e.target == modal) modal.style.display = "none";});


    var container = document.getElementsByClassName("sbclrd")[0];
    var backgroundColors = ["#fbb", "#9ce", "#9ce"];
    var originalTitle = document.title;
    var whiteImage = "data:image/png;base64,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";
    var orgWhiteImage = "data:image/png;base64,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";
    var redImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAB1DSURBVHhe7ZxbjGTHWcdP36fn2rO7Xjsbr3dkb8BICVkkyAMCsUG5OM7FgxOHgATZB8QjWREF20psr71rYpsgDC9cHqKJeIEn1m8xGDHe4PflBQWJSBMSy3Zs7/Zcevrezf/3fVXnnJ7L3rzrBOGa+fqrqlNVp+p3vq+qzulL8l54L7wX/i+HQtA/E+GZZ55ZQJf6/UZtPG7USqUG6Y3RaG1YqTQfeeSRddI/S+GnBvCvnnrqw0B6X6lw8sBwdGJxMDgxOxoujQeDZDQYJuPhMBlKxio7LhZFtZSMkWo1eb1YWn2rUFhtF4tr67XixT969PH/8Fbf/fCuAgTa3eXi8pH+8OT7B72ThU4nGff6yajXS4b9XjLqDwzacDTK9HicjFQXGYrmqFBIxuVSkpQr0uUkqVWT8eJi88fV2srlenX1Dx/9xgt2sncp3HKAuOXPDYenjnXay0eHg5PJ9nZSFLBRtytwgjfoJ0NZnUmEJhmMxqZHAjhUO0qaHgNQFjkuuFWOsM5qJSlUa0lhup5UDh5M/ntq6sxrlcrK1x577IfWiVsYbhlAwH1w0Dv9S6PR6elWq5G0WslYFjfqYmkI8OSuwVXd6gAGQEEDHFpOPCAeAGKJQDRLVPdHRYC6eydYZKWSFKenk1JjIfnJ4uLKq/X68199/Na5+E0HaBbX65365X73zFx7u1HYbicJriqLG8vyZGo2x6XwsLJgdSMBGwgg1ocGYF/wDKDaNhdGcyJZICATs0a3SqAmpbKsseIg6/WkuLCQvH374ZUfySpvhUXeVIDfOXfugV8Z9s4cabdPFLdaSUHuCrhEFpdofisIGovDWLCiAG0sWOaqWBwAQ3wgYBlATxtIyQjrkwbekGFIDyRY5Ehwce04R5ZnZpLyoUPJjw/fdvoPnnrqL+nrzQo3BSBW9+Fe58xH+v3T5Y31pCRwWF1B7lrQHJcIXEHuKR/VyKURQRkHAR46uq67rOsIEWiWRktU1PQEUCwRoGgBHGKVcu2iVu6RrLIsaxwevfPiD2ZmTt0st37HAP/s7Nlj94/759/fap8ob20mhda2wHW0UPQNXkHuWhhpiAAM4PLiEAHgIB2cipveG2DelTPBEpWPFUoDEItEADlgjhTIgtx66n13JD84fNvyV86efccrtlq98fDtc08+8Nle57u3b20tlZrrSVELRbnTTsqCV5LblrA8SVGWVxC8ogCYCFZJEAoW1zSmdNHSLkZUeR6CVp5dbSW9jgsDKOmIaRUgr0DJUJ60xRH1YajFayzPWGi3v/TJz32u8cKFCy9S5EbDDVvg35858+WP9rvPz7e2GqXNraTUbiclLRKl1GVlD7I65jk6byM3lQFJtYmsR9qtzhcPn/8yy8NtzcqCKOkal7W4Wx9lzPosXkj6GiXpXpCR5sahrLHSaCTdu5fO/96zz/6Wit5QuCGAwPt4v7MyvbmZlCRlzXdYnbusum3uqmFo4DYyXkwTDRE7FvNDPMyBgOsF7RAdpMGjGDUwsrT7PvdZU8oCZJwfdSkNoHqWaClL+lpkuuQxN05PJcnsXDL6wD2rv/vMMx+l+vWG6wYIvE8Muit1uWy55ZZXluUVAccch+VpwJNw9tBpmZyIDnMi8Lpqy0HmV+IAzyR0XeDsT0lz3QAyzoWABJ78QtYnUbwrrc2VYJaSAYuL9ozD4/es/v5zz103xOuaA7/95JMPnOy2/2Zuc2OqpAWjIsurRHgRHIHR2GAskelUhXgMVi3UlQKULSLSBi7Ck3aAXr+Qg1fUS1FxdEmiDYzNjWVLx+Oc2TBbF4gN5CnMv2PN459dfnDphX//3nUtLNcMkPvYjw265xc3NxvlrS2DN2F5BHXS4YW4R+w/vHjg2A5ormWB+osui9aUn6bZCwIyFifQVIRmi8nOeJrn5ehFdjouiKxcY+j3BkxFJ05+4fNr33355Wve4lwTQPZ5srzzd2xtLlW0YFS00la1mrG6TlhdFLqJSjUhjWQh1kVZHGtzl8WNbR6UW6dzoUpwqcwKDYb/meVJStpApwAlZZ0yDzFaKD0JZ7ZuqWmdd2Qwpnu95V/7/IOr/7y6ek13LbbKXy18sLN95khrS/u8Ld+maItiezu6QW/UqX3FC0j2CTYSHw4DMasz0RwoeBHkLpjc6knb/tFqE+TcOpXWCXNh3dQlFcWrytQOMKlJT0nqkhnJNHHlaylJylr4uhpf6/U3koNvvLGC0ViTVwlXBfh3mvc+1O2crmiPx4JREbwiq6w6b2B4KqKNqml1yIWa9rJ3oCr1jRuaxQMgoxRW10SD0vSAeL5DTe+XVdcgIorH5hgUELGoCYgSAALO4SUGryYhXlU73HoOXn1t6baNjRVlXTVc0YXNdXvt8wvrG42qAFbVeIVNsU5kgNSJVCxt1RTSyGSgntUNOifMRx1B6QgW0g7aQUar83lQxRyWAgtJungo7TqIKKLJM6iUD3XoM3HaQVi1ba7VOftMTd3uvb/+xS+uvnQVV6bNfcPxXuf0wubmUqm9nZQErxrheS8yIQTlIQ4vdI86eTECiCxZHR4rjZXthOdAZXnhuFmg6jnM3ZKt1Jk1EhgkiwgrcgVRuipJXVpxLBEhv6D5vXd5PTl4+fJVrXBfC+Qe91c72yszm5tTVbnulFbcCgO2ALgQ3S9oIM4PnROD5+CIA69n0MbJto5HeKTNfZVn85+aYhHBZdWCxDuQt8Ao0RJx47z2P6vEa2hHojQjwwq5CFygLlY4GDQ+9tBDay9eYVXe1wLvGfZP17d0m8Z2RfNehQFzNs7tveAlC2lvEL2YOCQHF6FlMtZCBKTtIA7Prc7mP9WLc6LPfXuLWyXWydzoj8MQg22i3krMEoOYNUpjcWaNOSFdEsDRViuZfvPNM0ruG/a0QOa+j7S2dKu2MVWT9U3LpMvqRXb1JOqQhaiJ0NO8AE8D8jjQYtofouKaQEtFi5NpHccKOW5w1LoDUXU/k0m0KLq00xI97fn6NyukrCVCoA3ai4L1IVi6WaH6MBgMG5/8nS+tvbi6uqcV7mmBS4Pe6Vprq1HUvMfDgbIayk4bA6cPGkCpqCsRVBS7N0bUPekRWwbJttIuDq6julge4EzUHhItaqe45YV4KE/a6ihNvq/SOi1dC31lLDwVSq1RcbY90RorSpsVqk89bW10z7+vFe4J8K5u91SxzTM9ua4GyuOmNKhxlxhH5/Kttzl4UeQSPJnh1glY5rZAlJjlIcpj7jPrU1spHNNYhqczyRYVF+qx1cGN/VgsF0Hq3/upwF0zAMy1lYfkQfJEiTe/Oj96dembuhNT1q6wC+Bfnzv3wGxra6nYw/oGNvfZM7p88F64pjPqoPdOOorqZeLweuoQwFrSW5KW8uL8hwAuLhw7578IyYCSjkIZ1YnAUrePonQEnt8zqpM2rvhM0qxSAkDmRhOOD4ZJn/v+VuuUsnaFXQAPjQYnE817vI/BRMpV4WQWiO8SAOW0BpO5rMdx2Y4ESFuCuSUNvFbIw/J80xzcT8JgbcA6LQM2ifmKox1SAEfc4JHOLDEeR9OuAZToX62EeV0Je+AqwbX9LsYhFlWvu91OCuvryxTdGXYBPNBtnyzIbHmuxxxAgzqPnSQVMiyu4UUd4aVaQxagYZjnDJzSCBaYtz6b/2zwDgdoaiWc1tNIfGszWlQUA6Y24j5x5xzqLh3gS3ZCJESQiENkjnSYuHL/rbeXnnn44V23dxMA/1x+Pt9un+DtR0wX+n7XoRAaNwFS1OpcHlr6xlGEZ8BcNgEX4SkdwTFIwKgVhZ3LVdi7ERShDKcDdAbQxSAiAI1QJRxzgOqT6hnAoPVvY+FCWULiluhWWCZLxtTh4XG5vGsxmQA4PxqdGGvxSHjSosGX1FN7PJlr3CVAi1qd3CnAY2EwVzULdMtz7flx3mNwakWAHBWvLr4FydIKnFbKrTGDmAfp82N038z64r1zaoVKR21/ipvoz1ZpnQOIxAe8w7i9fYIu5MMEwNnR4MSYN12CFbn7BlHadS69jzDnYV0Oya1wO2d5+XkPCGotDQZK1OLjKB4GpI+kdIxbMgSw1AOAwZmQvNXlgMW4auYh5sHxyQi9pIuLAVKaj6Ak2+0rA1wYDU/ykQsAFkIj1kvTEoPnJ3C9W1ht/VYsB0/xaHFYI3GOYyk0Dw20xQWKTjlA3S1oB2z3ryGdisrEztMdgyIxSOQp7n+066AiNNuQm47p3Zo/tm/0DA4YRX9zs7HzMdcEwGqvtxQBAsjmBQ3UhHiEF/N2CPXYhrQDOCA5yCwe93nRdQHGKwHri/et6e2WpFooJtUcSBflhbg9OFV5hDZs0NLWMDAAYILr74a1W/vY41xIexjGtubBcbd7kqZjSAHy8KDY6TT4zAqFuck3YGpELQZIUUfJ0sBjwmbemwSWWWTUiJVR29SxzqoPBk2xiiRamgEUPHueVyxmAA0oEIFbtLL21JkLoPoGUEE9NOszgGiJQQp6P4l9MitUI8Aca2HV+rBkDYeQAtR8Z/DsU1KS+CkpYBpI9ITk4MniuIlPwQQBmG2KVZZthe/zfIVk/mNR2ZBQx63R5zcHF+BIeOyUhxfhlkWLZ35pWkNmQAw8AgQhTacQkQjPtMZJ3IS4+qL+UM48UMEsUPHBUMY1GNinZmNIAZZL48ZA7muflLJGfBL2s08CywuABzl3je4ZN8a4dISWrpKIjlF+XVf1ss67rosXQWJFWBiWVzPt8IAU50ZfWNxqGYRZnerZys2AFDTsHDxpJZAMmAvnZOFB+4eavJyqhHbA4BDlaXsD1JLdGMgauFeNH27kSqD3AmdCg9JYWR6ePY5CctDoaDYQic5JRymzrvO+2R8kbwFScaADIbptnOsMljTHTCBmwKSJWmDgYbB2HocxCc5hZY++YtrhWV8l1oDqx2CfY5TkQ+bCg3Ej/wlRt5KwUtqId8CTmPVZOYcUb8WyvVd2+qjj4GMAJHVZsd+WFb6hTfxlaeZGAEW3xeJIGxjVQbuVSCMhTXuZZDDcXR2QS+h7Li+CtTrWMifyl/R8o9Hec+CoUGhyUm8UcLidWwiDwbUBFsUgIyrj24fQYURxO69egYV74XZ5N+TEe4HkbuUnskQgYhGUiW5LnHbjgL2veQB7Szzm0CRqF7G6YRymQxnK6t8CysfmcfqSDynAbpI0MU5OZhO+dOaSuUUhlxddFWAEBunvgjFgXNDnLpvLYlyCTmGqXoRJM/SBubApkNw/x07HupRjgAzWnryobLxdiwIE15kYJLQJx6Pk67nQPsaQF+uJppNhsdhUF9KQApR/NPlUJw2Z5emEKSydKELLFgsBVn5cHLhCDA4oNbUDsCmbv3wO862I4qZj2iWCByaBAcRHXgyIAMDpUimZkVCeiwaA9NGX+hSnD7RD9L5FcPnjFucC5Mrk4XkIn/ZS0mY+9blQKq0RjSEDqDBWARr1zvgqmllbBs/EjnsZOsHJFTWINGpQJHmrc2CCq/MAGNC2SEhYdSNIXJ72OCd9YTjMf9SfE8BGuSyY3vVojQZIZQ2KjcG1AwswrT3yQ9zyHHYU2rPzMRL967BPUcqzCaVU2tsC+9XqGt+94P0Arg5ggJQHFuMRqC8adC5cPdWNJwck9692P6uBG0DABXh1QasrzqcEeGuRvR75lKEs9WmTtpnA7U0h2pDMC+Ih9XVRILkITFgMkPKxjgFFDJhrtzzAedzLOMQ4Bh446BQmBODZu4GSQlkj2s+F+RrVaLre5DN00S2AtK3G87dfDjGkdXKDKDGAkjjZYjFikS4AQIlWCMQpkwjShTzfNFMWO8wmb+yCdISIJR6uVJLbBHFewkXgXJSlH25RgInAMoszDwsSoUfRYd8qSXibM307VfFqvZ6Ua7WLSqYhBUjYrtZWi9WKVTKAktQC1XJqfepIjMcrycmZK+LWgmAD1isdyruzua9kCtkB0UE6TMrnO+it+gBx+VlBPBggEqdtzsN544Lo1uheAjzbVaT5Lt539yDOUubiqX0unn06TBqYM42FpICn5sIEwG6lejGpVANAh2iuK2Fl3I46wNvtwt4JsxobrYaif05ij6PCAJGdlrgXSISyNEWbNEo8A+mb7Xm5VkOCS1MnbjWYPSNEd+FggdKx39b3UI6LbxebhqXh0NfJAGjf1atNre38wuMEwP5U7WJ5aso+T9xVo1ggj55awfqwQgOoWzcDqE74IjJ5JX1Dm7dEXGISYnxMFe91d4JkxY0w/K4iTA8hDkYw0RbWPF0smRXi2tOqx2JEoI6v2AFkgIjERcMvvpctq25FbfFhKSwVDrhvSZZempmZcF/CBMB2WS48O5sM1Qk+FusuHKDpZNGdgRet0K6mdAToENWZIEqmIBkTMLnAmVXmFhmDoYVFBVhcyKMBm8jTtj2dniO0TV3gszrXg1h9hVg/QoySb5N2KD6lsZdUF9dlzDAYqD8Y1rBa3fVZmQmAmGdnYeE8X0zhG5Ft9c3AGbwwB6rBuCI7RK7q7k5Zx2ygWGQGE5we3CqZI7EyX7HzlumgGVhqJTltt2cS/XtrKhsvRHR/VmjywJh356yfDhfrox2sryaARWkWU8bKVFbUij93cLFZm59f5Vz5MAGQ0KlPrybQDo2YqBF7iqwGzeoCNOLRIknbyoYWYOuoynlHXRhwfqGR0ivCqwezUAk5lKWebUXUplu6u2A8R9Z2Zo1cENtjhkWKFZ25jaOxfPb+iNdj0ZjRHFqVsGDY7kPHceGkovzG4upeX/jeBbBZqpyfWlhQJa3GapRPtXfUCNYGLPvUvNJ0HljkYZF7QXTtknY8Jz4AFwZhYImHPOYom69oK0DLLwbp6hrE2tQYAIXVYc1xXgUmwS6KSnhZPy/l2cxPCx5WqNta+6QYwnpQ5Wu0i4u7rI+wC+Bjjz32w9Hhw+f5IspAjfXVgH/HInxVQKezzipOZ4gDD7E7E6VTzYCD2IITxEE72DjwaK2kU/DKo7zdNto5ctry1Z6dK5xH+bRjFwQqCum0IOEvLipoW5SUx2erZ+SmtVLZxssjtRbtU0ZQZw4dalYXFvb8rOAugITWXOP56cXFZCwrZALlivAdi45ObGCUzuYPH7TtDTkW4YXB+aB9MUJi2jbhiJXLQTMJxyRe3mEhZvHIPg9x/YIFC6OPEkXNyrDOvNUh4pXUNd/PyE3Lmv8Yw4baaknzHeTK9HRSOXz78/v9XsOeAB9+4omXK3fcvsbvE4x1Vfh6lH95z+dE3xsFK5SggWjApPMDRuIg08GbBKgacB6Ci7fhwLM6PDP0eNSZUIcLEe+MIsRo1S6jYHURntxTkOa1962EcV7iIYbKInxBcfbAgaTYaJxX8T1DfACyK/zmJz/VLK03l/n6Vr/fT3hazfzEI29OzxyDWFA+uT6PcdWxTLfSOIBsINnkv5eO8VgX8flQovbNqnboiWOK0w87pj4gtBkBAxBX5r0UVtyGjGSuWrONclPl3tTFuaQLsoVlLjSS+bvvXnnyuef+VtX2DHtaIOGPz5z5Tv3Oo2sDFhOefMjM7aujiDpgliiJnXQrZMX2q+/WGCRnKQgLkn2wKErIy5fJSzyelpXm/eWYpkzq6jpfZoXZVEAceAQNQXNiMZnV2JCS4F1We28NBua+2yqD9dUPHmxWG40rfkJ1X4CE5nxjee7w4aRYm9K+sKKtjTbYunLMh+yPABjdOFoEV9sAGkQHGQeRnxNtzlTaB787bjB2itpE+/GwA8gJxzinl/V4hImVmvWJHncasxrPQnDdtvrd1MW4rHqbKqf73aQ2N5dMHz268tjTT1/xU/r7ujDh3y5ceOPT93/qRPvSpXvjO3b2iQUO6kSE+NlBFB1Eogub60m7OwLcXY3BxHtMs9yYH45Z/bwoP7aXplXf4zmtfHVvQiO+4CkEy5sDHpC0cGzp+FuCh9s2BX1dbY3rU8mBY8eas43F5ZdeeYU1c99wRQsktBcPnWqosfrcvP0Gwchc2bc3tIywzQGEwaPD0gaJY6bdKuMclwlbD99+pKL8XWLH3A2xbNJu2Tu08rE8Ox7rSdMfMbQ9HpY3V63YhpmvvTZVD/cFXkfjGskqG7ffnszedezUI88+e9VfSrqiBRJeeuml7kfv/8z3C63NL3Xa22ZxvOnuVogh+gLCvOJZ4SsDiI5pDG4J1FNePu4Sy+Tz9pZ8PUWzY5wnjfuxTLRkqHPAm5a7MufhtmxTgNdUhaZKEe/IOIqzM8niz9/7/BPf+tY1/TjFVQES/vXChf/6zIMPLvWazRN86JIVmWCrssTi6mi+43FAeTDAY4A+0NygJbGO1dex2E78YvXOMhPayrjEYHGB8zmPhwtaFMKCwRewAcZ8t6GSLZXZVpl57X0X77nn4uzS0ikMxxq6SrgmgIQXL3zvhU/f96mTnY3m0kCrlZHQyYPhGRACX1oxjehllBucpaXN6kxnx6hvOpe3r+gcMZ6afl5LuPfloQDw2K6w3yPNF6035UEt9ZytilkeX7yuVZOFO+9sztx17OTXn3jiDW/s6uGqc+BEOPL+5fnjxy9WNB9WZ2bsfrmgiZh38+wdPXWa7Q1zjlmejYnBhgErnUIIYiCvEV48Pumyuy8G54kQS+oXb0fSNzbHwNvUYRaPbeV1BXZqfi45dPRoc/b4B05ebdXdGa4LILczhaNLJ+eWltaG9XrCU5uRII4F0X56SZL/uRGeahjEMCCPEFwzWAtKxngKYQ8hRB3DRJpzSApaDHi6Yu/jKs0TFeBtSLZUbFOVLsuDANnXalw+eKDZuPcXTj9+7tx1/5bMNbtwDMwNn/jib69MFYv39bZbd3Czzpy1e2hueZnOQFhJAxqDD/xqIZZgXiOOYGWWlpjFoQUOgLg6AHkQYntX5WF1HSxSF70+P5/MHTnSPPShXzz9jXPnvmONX2e4boAEIH78Cw/9g1a2+3rt9h38BhaDwXUYiMEwibB4CXGC5YdMyqFCPMLw+pnEPNMKEZzNdUGsLpYnCzR4iiNsu4DXVh4A+9rCDOU985rz5o5/YFlue8M/wOO9eQfhuYf/5J/Wv/+fy6ONjWTYbicFftKO38ni3lkTtH9DSXOc5h7XrMQu9ieqbsEZ4JjOhwiOV6JC5cCUTgEaPPLDu2rSmgRt/uMnoNjH9qRntNrO3HXXWu3YkeXHH79+t82HG7LAfPiXV175x/se+nxT25v7el0tITaGMBAdL+BOYXBpflomHIv5NBjSWdmcdSFpe5lmrjMBmFbUMffuAsV7Oz3lc1/LYjGS1dUOHkjmjh9fmWscWP76uW++419zsz7fjHD27Nlj5TdeP9/6n7UT/Y1NWWLPf+6OLY9ulexz17LIaI3+q207hIaiDoF4vpNAs4tkLx5HY3W4rWjbQhZ/fAyrq7DYTdWSBc139aW7T8tlb2i+2ytw+psavvmNR7/Sf/XV59uvv56MtnXnIpc2iAO5cgoxioMzaHmICpafD9ZTB7YTHsIvWvqPMfqWamhPkLTNEriZgweb9TvvWunPzJx59hpuz64n0IVbEp7+2lf/Yvjaa6c7ly4lI24BA0j7oLbBk8Yy8wAFFJszdGSnOEM3TTkwFBZnYhaHxn395+7Gut+damiuO3JktXL7HWe0OX7Z2rjJIfTs1gTcOtnaOF26fOn01muvJfFbUO7WAAwLDeAMINthokYvBWivQAs6BWfwtEAI3ChanO4opmVx5YO3rUwfOnT+62fP3hJwMdxSgPnwp48//uXh5beXC5sby9tvX9KmTNtbvv1jIGWJEhGEXgCI9rp2Z6Gu2p2MgfM5jhUWiyvVtDgszCdTBw5eLDYWzpfHheev5UnKzQjvGsB8eObMmS8P1pvLo/bWiaS1vdRa11ixTJsjI8AwR6bwFDGLK5qL8mZPsV5vVubnLhbn5s9X6jOrj97CH5vdL/xUAO4MTz/55G8I4Imk310aDfoN7SEbw95QO5Pxkry6Wa5VdK9bXFNGc1yurFWmq2uF2syeb3S/F94L/59Ckvwv6pv1cVYbV9QAAAAASUVORK5CYII=";
    var orgRedImage = "data:image/png;base64,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";
    var whiteImages = [orgWhiteImage, whiteImage, orgWhiteImage];
    var redImages = [redImage, orgRedImage, orgRedImage];
    var lastTurn = 2;
    function getPlayerRating(playerName){
        var rows = document.getElementsByClassName("uls2")[0].rows;
        for(var i = 1; i < rows.length; i++){
            if(rows[i].cells[0].firstElementChild.firstElementChild && rows[i].cells[0].firstElementChild.firstElementChild.nextSibling.textContent === playerName)
                return rows[i].cells[2].innerText;
        }
    }
    function appendRating(playerNo){
        var pName = document.getElementsByClassName("f12")[playerNo].nextElementSibling.lastElementChild.lastElementChild.innerText;
        if(!pName)
            return;
        var parent = document.getElementsByClassName("f12")[playerNo];
        if(parent.firstElementChild)
        {
            var textNode = parent.firstElementChild.nextSibling;
            if(!pName || pName == "")
                textNode.textContent = "#" + (playerNo + 1);
            else{
                textNode.textContent = "(" + getPlayerRating(pName) + ")";
                var info = document.createElement("button");
                info.style.padding = 0;
                info.style.margin = 0;
                info.innerText = "Info";
                info.onclick = function(){
                    var xhr = new XMLHttpRequest();
                    xhr.open("GET", k2url.home + "stat.phtml?u=" + pName + "&g=bg");
                    xhr.onreadystatechange = function () {
                        if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                            var html = xhr.responseText;
                            var ix = html.indexOf('<div class="clcol">');
                            var ix2 = html.indexOf('</div>', ix);
                            modalContent.innerHTML = html.substring(ix, ix2);
                            modal.style.display = "block";
                        }
                    };
                    xhr.send();
                };
                parent.appendChild(info);
            }
        }
    }
    var timeout;
    var observer = new MutationObserver(function() {
        var turn = 2;
        if(document.getElementsByClassName("f12")[0].lastElementChild.style.visibility == "inherit") {
            turn = 0;
        }
        else if(document.getElementsByClassName("f12")[1].lastElementChild.style.visibility == "inherit")
            turn = 1;
        if(turn != 2)
            document.title = originalTitle + " #" + (turn + 1) + ">" + document.getElementsByClassName("ttlcont")[0].nextElementSibling.childNodes[0].childNodes[turn].childNodes[2].childNodes[1].innerText;
        observer.disconnect();
        appendRating(0);
        appendRating(1);
        observer.observe(document.getElementsByClassName("ttlcont")[0].nextElementSibling, {childList: true, subtree: true});

        if(turn == lastTurn)
        {
            if(timeout)
            {
                clearTimeout(timeout);
                timeout = 0;
            }
            return;
        }
        if(!document.hasFocus())
            timeout = setTimeout(function(){new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(1e3).join(123)).play(); timeout = 0;}, 1000);
        var images = document.querySelectorAll("img[src^='data:image/png'");
        for(var i = 0; i < images.length; i++){
            if(images[i].getAttribute("src") === orgWhiteImage ||images[i].getAttribute("src") === whiteImage)
                images[i].setAttribute("src", whiteImages[turn]);
            else if(images[i].getAttribute("src") === orgRedImage ||images[i].getAttribute("src") === redImage)
                images[i].setAttribute("src", redImages[turn]);
        }

        document.getElementsByClassName("sbclrd")[0].style.backgroundColor =  backgroundColors[turn];
        lastTurn = turn;
    });
    observer.observe(document.getElementsByClassName("ttlcont")[0].nextElementSibling, {childList: true, subtree: true});

    new MutationObserver(function(){ //click pass
        if(dialogs[2].style.display !== "none")
            dialogs[2].childNodes[0].childNodes[0].click();
    }).observe(dialogs[2], {attributes: true});
    document.getElementsByClassName("trqcont")[0].firstElementChild.insertAdjacentHTML("afterEnd", '<div style="line-height: initial; padding: 3px 0 32px 0;"><div style="float: left;"><div><input type="checkbox" id="chkAutoRoll" checked="true" onchange="autoRollChanged(this.checked);" /><label for="chkAutoRoll">Auto-Roll</label></div><div><input type="checkbox" id="chkDouble" /><label for="chkDouble">Double Next Turn</label></div></div><div style="float: left; margin-left: 14px;"><div id="pip1"></div><div id="pip2"></div></div></div>');
    var pip1Div = document.getElementById("pip1");
    var pip2Div = document.getElementById("pip2");
    var targetNode = dialogs[1];
    var btnRoll = targetNode.childNodes[0].childNodes[0];
    var btnDouble = document.getElementsByClassName("ctpan")[1].childNodes[0].childNodes[1];
    var chkAutoRoll = document.getElementById("chkAutoRoll");
    var chkDouble = document.getElementById("chkDouble");

    new MutationObserver(function(){ //click roll
        if(targetNode.style.display === "none")
            return;
        if(chkDouble.checked && !btnDouble.disabled) {
            btnDouble.click();
            chkDouble.checked = false;
            return;
        }
        if(chkAutoRoll.checked) {
            btnRoll.click();
        }
        if(chkAutoRoll.checked)
            btnRoll.click();
    }).observe(targetNode, {attributes: true});

    var cssHide = document.createElement("style");
    cssHide.innerHTML = "div.ctpan:nth-of-type(n+2), div.ctpan:nth-of-type(n+2) * { visibility: hidden; position: fixed; top: -9999px; left: -9999px; }";
    document.body.appendChild(cssHide);

    window.autoRollChanged = function(autoRoll){
        if(autoRoll){
            document.body.appendChild(cssHide);
            if(targetNode.style.display !== "none")
                btnRoll.click();
        }
        else
            document.body.removeChild(cssHide);
    };
})();