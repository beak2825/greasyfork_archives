// ==UserScript==
// @name:en-US           CCTV-HLS
// @name                 央视网hls链接视频解析
// @description:en-US    CCTV Network HLS Link Video Analysis
// @description          央视网HLS链接视频解析
// @namespace            https://greasyfork.org/
// @version              1.0.22
// @author               you
// @license              CC
// @grant                none
// @run-at               document-end
// @match                https://v.cctv.com/*/V*.shtml*
// @match                https://tv.cctv.com/v*/v*/V*.html*
// @match                https://v.cctv.cn/*/V*.shtml*
// @match                https://tv.cctv.cn/*/V*.shtml*
// @match                https://tv.cctv.com/*/V*.shtml*
// @match                https://news.cctv.com/*/V*.shtml*
// @match                https://ent.cctv.com/*/V*.shtml*
// @match                https://local.cctv.com/*/V*.shtml*
// @match                https://yangbo.cctv.com/*/V*.shtml*
// @match                https://sports.cctv.com/*/V*.shtml*
// @match                https://opinion.cctv.com/*/V*.shtml*
// @match                https://finance.cctv.com/*/V*.shtml*
// @match                https://edu.cctv.com/*/V*.shtml*
// @match                https://www.ipanda.com/*/V*.shtml*
// @match                https://livechina.cctv.com/*/V*.shtml*
// @match                https://eco.cctv.com/*/V*.shtml*
// @match                https://ydyl.cctv.com/*/V*.shtml*
// @match                https://culture-travel.cctv.com/*/V*.shtml*
// @match                https://jiankang.cctv.com/*/V*.shtml*
// @match                https://laoling.cctv.com/*/V*.shtml*
// @match                https://book.cctv.com/*/V*.shtml*
// @match                https://5gai.cctv.com/*/V*.shtml*
// @match                https://5g.cctv.com/*/V*.shtml*
// @match                https://business.cctv.com/*/V*.shtml*
// @match                https://wangzhan.cctv.com/*/V*.shtml*
// @match                https://www.cctvmall.com/*/V*.shtml*
// @match                https://chunwan.cctv.com/*/V*.shtml*
// @match                https://politics.cntv.cn/*/V*.shtml*
// @match                https://www.ncpa-classic.com/*/V*.shtml*
// @match                http://english.cntv.cn/*/V*.shtml*
// @match                http://english.cctv.com/*/V*.shtml*
// @match                http://m.cctv.com/dc*/v*/index.shtml?guid=*
// @match                http://tv.cctv.com/dc*/v*/index.shtml?guid=*
// @match                http://dianshiju.cctv.com/*/V*.shtml*
// @match                https://energy.cctv.com/*/V*.shtml*
// @match                https://kejiao.cctv.com/*/V*.shtml*
// @match                https://news.cctv.com/china/*/*.shtml*
// @match                https://sports.cctv.com/*/*.shtml*
// @match                https://xwzs.cctv.com/*/V*.shtml*
// @match                https://jingji.cctv.com/*/V*.shtml*
// @match                https://culture-travel.cctv.com/*/*.shtml*
// @match                https://*.cctv.com/*/*shtml*
// @match                https://english.cctv.com/*/V*.shtml*
// @match                https://vip.sports.cctv.com/video/*
// @icon                   https://tv.cctv.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/488893/%E5%A4%AE%E8%A7%86%E7%BD%91hls%E9%93%BE%E6%8E%A5%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/488893/%E5%A4%AE%E8%A7%86%E7%BD%91hls%E9%93%BE%E6%8E%A5%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==
(function () {
    function loop() {
        if ((typeof videoid) == "undefined") {
            setTimeout(loop, 500);
        }
        var hvu = "https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?pid=" + guid;
        if (this.videoid == "myPlayer") {
            document.querySelector("#myPlayer").innerHTML = null;
            var cctvb = document.createElement("a");
            cctvb.style.display = "grid";
            cctvb.textContent = "#JSON#";
            cctvb.style.float = "left";
            cctvb.style.fontSize = "2vw";
            cctvb.style.color = "#48EFEF";
            cctvb.href = hvu;
            document.querySelector("#via_title").appendChild(cctvb);
            $.getJSON(hvu, function (res) {
                var cctva = document.createElement("a");
                cctva.style.display = "grid";
                //cctva.textContent = "#MP4#";
                cctva.textContent = "#HLS#";
                cctva.style.float = "right";
                cctva.style.fontSize = "2vw";
                cctva.style.color = "#28EFEF";
                document.querySelector("#via_title").appendChild(cctva);
                //cctva.href = res.video.chapters4[0].url;
                cctva.href = res.hls_url.replaceAll("main", "4000");
                 });
        }
        else if (videoid == "_video") {
            setTimeout(function () {
                document.querySelector("#video").innerHTML = null;
            }, 1000);
            var cctvc = document.createElement("a");
            cctvc.style.display = "grid";
            cctvc.style.float = "left";
            cctvc.textContent = "#JSON#";
            cctvc.style.fontSize = "2vw";
            cctvc.style.color = "#48EFEF";
            document.querySelector("#video").parentElement.appendChild(cctvc);
            cctvc.href = hvu;
            $.getJSON(hvu, function (res) {
                var cctva = document.createElement("a");
                cctva.style.display = "grid";
                cctva.style.float = "right";
                cctva.textContent = "#HLS#";
                cctva.style.fontSize = "2vw";
                cctva.style.color = "#28EFEF";
                var codemain = res.hls_url;
                var code2048 = codemain.replaceAll("main", "2048");
                cctva.href = code2048;
                document.querySelector("#video").parentElement.appendChild(cctva);
                var cctvv = document.createElement("a");
                cctvv.style.display = "grid";
                cctvv.style.float = "left";
                cctvv.style.width = "100%";
                cctvv.textContent = codemain;
                cctvv.style.fontSize = "2vh";
                cctvv.style.color = "#28EFEF";
                document.querySelector("#video").parentElement.appendChild(cctvv);
                cctvv.onclick = function () {
                    window.open(codemain);
                };
            });
        }
        else if (videoid == "myFlash") {
            document.querySelector("#myFlash").parentElement.innerHTML = null;
            var cctvd = document.createElement("a");
            cctvd.style.display = "grid";
            cctvd.style.float = "left";
            cctvd.textContent = "#JSON#";
            cctvd.style.fontSize = "2vw";
            cctvd.style.color = "#48EFEF";
            cctvd.href = hvu;
            document.querySelector("#page_body").children[1].firstElementChild.append(cctvd);
            $.getJSON(hvu, function (res) {
                var cctve = document.createElement("a");
                cctve.style.display = "grid";
                cctve.style.float = "right";
                cctve.textContent = "#HLS#";
                cctve.style.fontSize = "2vw";
                cctve.style.color = "#28EFEF";
                cctve.href = res.hls_url;
                document.querySelector("#page_body").children[1].firstElementChild.appendChild(cctve);
            });
        }
    }
    loop();
})();