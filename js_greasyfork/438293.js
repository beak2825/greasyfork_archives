// ==UserScript==
// @name            Vajehyab Assistan
// @name:fa      	دستیار واژه‌یاب
// @version         0.11
// @author          Amir
// @description     Use the VajehYab.com website as a dictionary. Just double-click or select any text, and the results will appear as a smooth and light pop-up. It is a translator that you can enable/disable by using Ctrl + Alt + Q.
// @description:fa  کلمه انتخاب شده را در سایت واژه‌یاب جستجو و نمایش می‌دهد
// @namespace       amm1rr
// @match           https://twitter.com/*
// @include         *
// @homepage        https://github.com/Amm1rr/Vajehyab-Assistant
// @icon            https://vajehyab.com/assets/icons/180.png
// @source          https://github.com/Amm1rr/Vajehyab-Assistant
// @supportURL      https://github.com/Amm1rr/Vajehyab-Assistant/issues
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require         https://code.jquery.com/jquery-3.6.0.slim.min.js
// @resource        https://github.com/Amm1rr/Vajehyab-Assistant/raw/main/ref/style-minimal.min.css
// @grant           GM_xmlhttpRequest
// @grant           GM_getResourceText
// @connect         vajehyab.com
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/438293/Vajehyab%20Assistan.user.js
// @updateURL https://update.greasyfork.org/scripts/438293/Vajehyab%20Assistan.meta.js
// ==/UserScript==

// window.getSelection().toString()

// window.document.body.addEventListener("mouseup", translate, false);
window.document.body.addEventListener("click", translate, false);
window.document.body.addEventListener("keyup", toggleVajehyab, false);
var toggle = true;

// Ctrl + Alt + Q => Toggle Enable\Disable Vajehyab Assistant
function toggleVajehyab(e) {
    if (e.which == 81 && e.altKey && e.ctrlKey) {
        if (toggle) {
            window.document.body.removeEventListener("click", translate, false);
            toggle = false;
        } else {
            window.document.body.addEventListener("click", translate, false);
            toggle = true;
        }
    }
}

function translate(e) {
    // remove previous .vajehPopup if exists
    PopupsRemover();
    // console.log("translate start");
    var selectObj = document.getSelection();

    // if #text node
    if (selectObj.anchorNode && selectObj.anchorNode.nodeType == 3) {
        //GM_log(selectObj.anchorNode.nodeType.toString());
        var word = selectObj.toString();
        if (word == "") {
            return;
        }
        // linebreak wordwrap, optimize for pdf.js
        word = word.replace("-\n", "");
        // multiline selection, optimize for pdf.js
        word = word.replace("\n", " ");
        //console.log("word:", word);
        var ts = new Date().getTime();
        //console.log("time: ", ts);
        var mx = e.clientX;
        var my = e.clientY;
        GetTranslate(word, ts);
    }

    function PopupsRemover() {
        // remove previous .vajehPopup if exists
        var previous = document.querySelector(".vajehPopup");
        while (previous) {
            document.body.removeChild(previous);
            previous = document.querySelector(".vajehPopup");
        }

        previous = document.querySelector("#vajehiframe");
        while (previous) {
            document.body.removeChild(previous);
            previous = document.querySelector("#vajehiframe");
        }
    }

    // function calculatePosition(x, y, popup) {
    //     const pos = {};
    //     const margin = 5;
    //     const anchor = 10;

    //     const outerWidth = $(popup).outerWidth();
    //     const outerHeight = $(popup).outerHeight();

    //     // show popup to the right of the word if it fits into window this way
    //     if (x + anchor + outerWidth + margin < $(window).width()) {
    //         pos.x = x + anchor;
    //     }
    //     // show popup to the left of the word if it fits into window this way
    //     else if (x - anchor - outerWidth - margin > 0) {
    //         pos.x = x - anchor - outerWidth;
    //     }
    //     // show popup at the very left if it is not wider than window
    //     else if (outerWidth + margin * 2 < $(window).width()) {
    //         pos.x = margin;
    //     }
    //     // resize popup width to fit into window and position it the very left of the window
    //     else {
    //         const non_content_x = outerWidth - $(popup).width();

    //         $(popup).width($(window).width() - margin * 2 - non_content_x);

    //         pos.x = margin;
    //     }

    //     // show popup above the word if it fits into window this way
    //     if (y - anchor - outerHeight - margin > 0) {
    //         pos.y = y - anchor - outerHeight;
    //     }
    //     // show popup below the word if it fits into window this way
    //     else if (y + anchor + outerHeight + margin < $(window).height()) {
    //         pos.y = y + anchor;
    //     }
    //     // show popup at the very top of the window
    //     else {
    //         pos.y = margin;
    //     }

    //     return pos;
    // }

    function calculatePosition(x, y, popup) {
        const pos = {};
        const margin = 5;
        const anchor = 10;

        const outerWidth = $(popup).outerWidth();
        const outerHeight = $(popup).outerHeight();

        // show popup to the right of the word if it fits into window this way
        if (x + anchor + outerWidth + margin < $(window).width()) {
            pos.x = x + anchor;
        }
        // show popup to the left of the word if it fits into window this way
        else if (x - anchor - outerWidth - margin > 0) {
            pos.x = x - anchor - outerWidth;
        }
        // show popup at the very left if it is not wider than window
        else if (outerWidth + margin * 2 < $(window).width()) {
            pos.x = margin;
        }
        // resize popup width to fit into window and position it the very left of the window
        else {
            const non_content_x = outerWidth - $(popup).width();

            $(popup).width($(window).width() - margin * 2 - non_content_x);

            pos.x = margin;
        }

        // show popup above the word if it fits into window this way
        if (y - anchor - outerHeight - margin > 0) {
            pos.y = y - anchor - outerHeight;
        }
        // show popup below the word if it fits into window this way
        else if (y + anchor + outerHeight + margin < $(window).height()) {
            pos.y = y + anchor;
        }
        // show popup at the very top of the window
        else {
            pos.y = margin;
        }

        const scrollBarWidth = $(window).width() - $(document).width();

        if (scrollBarWidth > 0) {
            margin += scrollBarWidth;
        }

        if (window.orientation === "landscape") {
            const temp = pos.x;
            pos.x = pos.y;
            pos.y = temp;
        }

        if (pos.x === x + anchor) {
            const scrollBarLeft = $(window).scrollLeft();

            if (scrollBarLeft > x) {
                pos.x -= scrollBarLeft;
            }
        }

        return pos;
    }

    function getParameter(jsonData, parameter, wrd) {
        let jsdata = JSON.parse(jsonData);
        let data;

        try {
            data = jsdata.props.pageProps.fallback[wrd + ":"].data;
        } catch (error) {
            return undefined;
        }

        if (typeof data === "undefined") {
            return undefined;
        }

        switch (parameter) {
            case "Query":
                return data.Query ? data.Query : undefined;
            case "Id":
                return data.Id ? data.Id : undefined;
            case "Exact": {
                const exact = [];

                if (data.WordBox) {
                    // console.log(data.WordBox);

                    let nullCount = 0;
                    let totalCount = 0;

                    for (const dictionaryName in data.WordBox) {
                        totalCount++;
                        if (data.WordBox.hasOwnProperty(dictionaryName)) {
                            const dictionary = data.WordBox[dictionaryName];
                            if (dictionary && dictionary.dictionary) {
                                const dicname = dictionary.dictionary;
                                // console.log(`Title for ${dictionaryName}: ${dicname}`);

                                const dataobjEntry = {
                                    dictionary: dicname,
                                    dictionary_id: dictionary.dictionary_id,
                                    id: dictionary.id,
                                    score: dictionary.score,
                                    slug: dictionary.slug,
                                    summary: dictionary.description,
                                    title: dictionary.title,
                                };

                                // Add dataobjEntry to eact array
                                exact.push(dataobjEntry);
                            } else {
                                //// Count null dictionary.id values
                                // if (dictionary.id === null) {
                                nullCount++;
                                // }
                                // Check if more than half of dictionary.id values are null
                            }

                            // switch (dictionaryName) {
                            //     // case "Query":
                            //     case "Amid":
                            //         exact.push();
                            //     // case "Motaradef":
                            //     // case "Sereh":
                            //     // case "En2fa":
                            //     // case "Fa2en":
                            // }
                        }
                    }
                    if (nullCount > totalCount / 2) {
                        if (data.Exact) {
                            for (const doc of data.Exact.Docs) {
                                exact.push(doc);
                            }
                        }

                        if (exact.length == 0) {
                            const similar = [];
                            if (data.Similar) {
                                for (const doc of data.Similar.Docs) {
                                    exact.push(doc);
                                }
                            }
                        }
                    }

                    return exact;
                } else {
                    if (data.Exact) {
                        for (const doc of data.Exact.Docs) {
                            exact.push(doc);
                        }
                    }

                    if (exact.length == 0) {
                        const similar = [];
                        if (data.Similar) {
                            for (const doc of data.Similar.Docs) {
                                exact.push(doc);
                            }
                        }
                    }
                    return exact;
                }
            }
            case "Similar":
                return data.Similar ? data.Similar : undefined;

            case "Text":
                return data.Text ? data.Text : undefined;
            case "Prefix":
                return data.Prefix ? data.Prefix : undefined;
            case "Mlt":
                return data.Mlt ? data.Mlt : undefined;
            case "Spell":
                return data.Spell ? data.Spell : undefined;
            case "Random":
                return data.Random ? data.Random : undefined;
            case "WordBox":
                return data.WordBox ? data.WordBox : undefined;
            default:
                return undefined;
        }
    }

    function popup(mx, my, result, wrd) {
        PopupsRemover();

        /* HTML Parse */
        const parser = new DOMParser();
        const page = parser.parseFromString(result, "text/html");
        const jsontag = page.querySelector("#__NEXT_DATA__");
        const json = jsontag.innerHTML;

        const res = getParameter(json, "Exact", wrd);

        if (
            typeof res === "undefined" ||
            !Array.isArray(res) ||
            res.length < 1 ||
            typeof res[0] === "undefined" ||
            res[0].length < 2
        ) {
            console.log("یافت نشد");
            return;
        }

        // // Move amid's dictionary first.
        // res.sort((a, b) => {
        //     if (a.dictionary === "amid") return -1;
        //     if (b.dictionary === "amid") return 1;
        //     return a.dictionary.localeCompare(b.dictionary);
        // });

        // Mapping of English dictionary names to Persian Names
        const dictionaryNames = {
            amid: "امید",
            dehkhoda: "دهخدا",
            moein: "معین",
            isfahani: "اصفهانی",
            mazani: "مازنی",
            fa2en: "انگلیسی",
            motaradef: "مترادف",
            fa2tr: "ترکی",
            fa2ar: "عربی",
            en2fa: "EN",
            ar2fa: "AR",
            sereh: "سِرِه",
            wiki: "ویکی",
        };

        // console.log(res);
        // console.log(res[0].title);

        /* HTML Parse */
        var iframe = document.createElement("iframe");
        iframe.src = "about:blank";
        iframe.id = "vajehiframe";

        // main window
        // first insert into dom then there is offsetHeight！IMPORTANT！
        // document.body.appendChild(vajehWindow);
        document.body.appendChild(iframe);

        var direc = "rtl";
        var html =
            "<html><head><title>واژه‌یاب فارسی</title>" +
            ' </head><body style="padding-bottom: 0px; direction:rtl; padding-right:15px;">';
        for (let i = 0; i < res.length; i++) {
            const persianDictionary =
                dictionaryNames[res[i].dictionary] || res[i].dictionary;

            if (persianDictionary == "انگلیسی" || persianDictionary == "ترکی") {
                direc = "ltr";
            } else {
                direc = "rtl";
            }

            html +=
                "<header><div style='float:right;color:rgb(158, 63, 26);'>" +
                res[i].title +
                "</div><div style='float:left;font-size:12px;color:green;'>" +
                persianDictionary +
                "</div></header><br><hr>";
            html +=
                "<div style='direction:" +
                direc +
                "; font-size:14px;'>" +
                res[i].summary +
                "</div><br>";
        }
        html += "</body></html>";

        iframe.srcdoc = html;
        let vajehWindow = iframe;
        vajehWindow.style.color = "blue";
        vajehWindow.style.textAlign = "right";
        vajehWindow.style.display = "block";
        vajehWindow.style.position = "fixed";
        vajehWindow.style.background = "lightblue";
        vajehWindow.style.borderRadius = "5px";
        vajehWindow.style.boxShadow = "0 0 5px 0";
        vajehWindow.style.opacity = "0.9";
        vajehWindow.style.width = "20%";
        vajehWindow.style.overflowWrap = "break-word";
        vajehWindow.style.left = mx - 40 + "px";
        // vajehWindow.style.dir = "rtl";

        var cssstyle = {
            "overflow-y": "scroll",
            height: "40%",
        };
        Object.assign(vajehWindow.style, cssstyle);

        var pos = calculatePosition(mx, my, vajehWindow);

        if (pos.x >= window.innerWidth || 500 >= window.innerWidth) {
            vajehWindow.style.left = "20px";
            vajehWindow.style.width = window.innerWidth - 55 + "px";
            vajehWindow.style.height = "25%";
        } else if (1000 >= window.innerWidth) {
            vajehWindow.style.width = "30%";
            vajehWindow.style.height = "25%";
        } else {
            vajehWindow.style.left = pos.x;
        }

        if (pos.y + vajehWindow.offsetHeight + 10 >= window.innerHeight) {
            vajehWindow.style.bottom = "10px";
        } else {
            vajehWindow.style.top = pos.y + 10 + "px";
        }

        if (my + vajehWindow.offsetHeight + 10 >= window.innerHeight) {
            //vajehWindow.style.bottom = "10px";
            //console.log("Height bottom");
        } else {
            vajehWindow.style.top = my + 15 + "px";
            //console.log("Height top");
        }

        if (pos.x + vajehWindow.offsetWidth + 55 >= window.innerWidth) {
            vajehWindow.style.left = window.innerWidth - vajehWindow.offsetWidth - 20 + "px";
        }

        vajehWindow.style.padding = "5px";
        vajehWindow.style.zIndex = "999999";
    }

    function GetTranslate(wrd, ts) {
        // var reqUrl = `https://www.vajehyab.com/?q=${word}&d=en&_=1617191412351&ts=${ts}`;
        // var reqUrl = `https://www.vajehyab.com/?q=${word}&d=en`;
        let trimWord = wrd.trim();
        let reqUrl = `https://vajehyab.com/?q=${trimWord}`;
        //console.log("request url: ", reqUrl);
        let ret = GM.xmlHttpRequest({
            method: "GET",
            url: reqUrl,
            headers: { Accept: "application/json" }, // can be omitted...
            onreadystatechange: function (res) {
                //console.log("Request state changed to: " + res.readyState);
            },
            onload: function (res) {
                let retContent = res.response;
                // console.log(retContent);
                // const parser = new DOMParser();
                // retContent = parser.parseFromString(retContent, 'text/html');
                popup(mx, my, retContent, trimWord);
            },
            onerror: function (res) {
                console.log("error");
            },
        });
    }
}
