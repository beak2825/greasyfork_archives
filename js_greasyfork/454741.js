// @license Apache
(function () {
    'use strict';
    var urlp;
    urlp = window.location.href;

    setInterval(function () {
        if (urlp.slice(25, 38) ==="campaign_list"){
        let btn = document.createElement("button");
        btn.innerText = "调整";
        btn.setAttribute("class", "next-btn next-medium next-btn-normal ml10");
        let change = document.querySelector(".next-btn.next-medium.next-btn-normal.ml10");
        let changeall = document.querySelectorAll(".next-btn.next-medium.next-btn-normal.ml10");
        if (change.innerText === "查询") {
            change.parentElement.insertBefore(btn, change);
        } else if (changeall[2].innerText === "查询") {
            changeall[2].parentElement.insertBefore(btn, changeall[2]);
        }

        let once = function (fn) {
            let caller = true;
            return function () {
                if (caller) {
                    caller = false
                    fn.apply(this, arguments)
                }
            }

        }

        btn.onclick = function () {
            setInterval(function () {
                isFixed();
            }, 100);

            function isFixed() {
                var gd = document.getElementsByClassName("next-table-lock-left")[0];

                if (gd) {
                    gd.setAttribute('style', 'display:none !important')
                }
                var gd1 = document.getElementsByClassName("next-table-lock-left")[1];

                if (gd1) {
                    gd1.setAttribute('style', 'display:none !important')
                }
            }


            setInterval(function () {
                delOnOff();
            }, 100);

            function delOnOff() {
                var textstaus = document.getElementsByClassName("status-text");
                for (let i = 0; i < textstaus.length; i++) {
                    textstaus[i].setAttribute('style', 'display:none !important');
                }
            }

            setInterval(once(function () {
                tabpad();
            }), 100);
            function tabpad() {
                var tablepad = document.getElementsByClassName("next-table-cell-wrapper");
                for (let t = 0; t < tablepad.length; t++) {
                    if (tablepad) {
                        tablepad[t].style.padding = "12px 6px";
                    }
                }
            }

            setInterval(once(function () {
                adjustWidth();
            }), 100);

            function adjustWidth() {
                var colgArr = document.querySelectorAll("table > colgroup");
                var w = [
                    "width: 20px;",
                    "width: 50px;",
                    "width: 80px;",
                    "width: 100px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                    "width: 80px;",
                ];
                if (colgArr) {
                    for (let c = 0; c < colgArr.length; c++) {
                        for (let l = 0; l < colgArr[c].childElementCount; l++) {

                            colgArr[c].children[l].setAttribute("style", w[l]);

                        }
                    }
                }
            }
            setInterval(once(function () {
                delAsk();
            }), 100);
            function delAsk() {

                for (let i = 1; i < 15; i++) {
                    let gg = document.getElementsByClassName("next-icon next-icon-icon_question_fill next-small")[i];
                    gg.setAttribute('style', 'display:none !important');
                }
            }
            };
        }
    }, 5000)
})();