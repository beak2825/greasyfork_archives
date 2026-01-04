// ==UserScript==
// @name         ximalaya-download
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @grant        none
// @version      1.5.2
// @author       zwb83925462
// @license      BSD
// @description  喜马拉雅音乐或视频下载
// @run-at       document-end
// @require      https://registry.npmmirror.com/ajax-hook/3.0.3/files/dist/ajaxhook.min.js
// @require      https://registry.npmmirror.com/crypto-js/4.2.0/files/crypto-js.js
// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js
// @match        https://www.ximalaya.com/album/*
// @match        https://www.ximalaya.com/sound/*
// @match        https://m.ximalaya.com/album/*
// @match        https://m.ximalaya.com/*/album*
// @match        https://mobile.ximalaya.com/mobile/*
// @downloadURL https://update.greasyfork.org/scripts/438365/ximalaya-download.user.js
// @updateURL https://update.greasyfork.org/scripts/438365/ximalaya-download.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    //获取单曲解析结果
    if (location?.pathname?.indexOf("/sound/") == 0) {
        let playurl;
        if (window.location.pathname.indexOf("sound") > 0) {
            setTimeout(async function () {
                let trackid = window.location.pathname.split("/")[2];
                let stitle = "xm";
                let xmitem = { id: trackid, ttl: stitle };
                let link = document.createElement("a");
                let container = document.body;
                link.id = "mp4";
                link.style = "position:fixed;top:10%;left:2%";
                link.style.display = "block";
                link.style.color = "#230de5";
                await getAllMusicURL2(xmitem).then(result => {
                    playurl = result?.toString();
                    return playurl;
                }).then(data => {
                    if (data == undefined) {
                        link.textContent = "未购买,无法下载";
                        link.style.fontSize = "20px";
                        link.style.color = "#F00";
                    } else {
                        link.download = xmitem.ttl;
                        link.textContent = xmitem.ttl;
                        console.log(link.href = data);
                    }
                });
                container.append(link);
            }, 2000);
        }
        async function getAllMusicURL2(item) {
            function decrypt(t) {
                return CryptoJS.AES.decrypt({
                    ciphertext: CryptoJS.enc.Base64url.parse(t)
                }, CryptoJS.enc.Hex.parse('aaad3e4fd540b0f79dca95606e72bf93'), {
                    mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7
                }).toString(CryptoJS.enc.Utf8);
            }
            let res = null;
            let ares = null;
            const timestamp = Date.parse(new Date());
            let url = `https://www.ximalaya.com/mobile-playpage/track/v3/baseInfo/${timestamp}?device=web&trackId=${item.id}&forVideo=true&needMp4=true`;
            let aurl = `https://www.ximalaya.com/mobile-playpage/track/v3/baseInfo/${timestamp}?device=web&trackId=${item.id}`;
            $.ajax({
                type: 'get',
                url: aurl,
                async: false,
                dataType: "json",
                success: function (resp) {
                    try {
                        ares = decrypt(resp.trackInfo.playUrlList[0].url);
                        item.ttl = resp.trackInfo.title;
                    } catch (e) {
                        console.log("无效");
                    }
                }
            });
            $.ajax({
                type: 'get',
                url: url,
                async: false,
                dataType: "json",
                success: function (resp) {
                    try {
                        res = decrypt(resp.trackInfo.playUrlList[0].url);
                        item.ttl += ".mp4";
                    } catch (e) {
                        console.log("解密错误，无视频");
                        res = ares;
                        item.ttl += ".m4a";
                    }
                }
            });
            return res;
        }
    }

    if (location?.hostname == "mobile.ximalaya.com" && location?.pathname?.indexOf("/mobile/") == 0){
        setTimeout( ()=>{
            let resp = JSON.parse(document?.body?.textContent);
            document.body.innerHTML=null;
            const jsondata = resp;
            let data = jsondata?.data;
            let alt = [];
            let ttls = [];
            let ttc = data?.totalCount;
            let pagenums = data?.maxPageId
            console.log(ttc + "个", pagenums + "页");
            let tracks = data?.list;
            console.log(tracks);
            if (tracks == undefined) {
                alert("请刷新专辑页重试");
            } else {
                tracks.forEach(i => {
                    alt.push(i.trackId);
                    ttls.push(i.title);
                });
                let doctitle=tracks[0]?.albumTitle + "---" + tracks[0]?.nickname;
                let titleElement = document.createElement('h2');
                titleElement.textContent = doctitle;
                document.body.prepend(titleElement);
                let morehtm = `<p id=tip>专辑曲目共${ttc}条.</p>`;
                let pns = pagenums;
                if (pns > 1) { morehtm = `<p id=tip>专辑曲目共${ttc}条.每页最多200条,最大页码为${pns}</p>`; }
                let alink = document.createElement("p");
                alink.innerHTML = morehtm;
                document.body.append(alink);
                
                // 添加分页导航
                if (pns > 1) {
                    let pagination = document.createElement("div");
                    pagination.style.margin = "10px 0";
                    pagination.style.textAlign = "center";
                    let pageId = data?.pageId;
                    let params = new URLSearchParams(location.search);
                    // 上一页按钮
                    if (pageId > 1) {
                        let prevLink = document.createElement("a");
                        params.set('pageId', pageId-1);
                        prevLink.href = location.pathname + '?' + params.toString();
                        prevLink.textContent = "上一页";
                        prevLink.style.marginRight = "10px";
                        prevLink.style.color = "#088";
                        pagination.appendChild(prevLink);
                    }
                    
                    // 页码显示
                    let pageInfo = document.createElement("span");
                    pageInfo.textContent = `第 ${pageId} 页 / 共 ${pns} 页`;
                    pageInfo.style.margin = "0 10px";
                    pagination.appendChild(pageInfo);
                    
                    // 下一页按钮
                    if (pageId < pns) {
                        let nextLink = document.createElement("a");
                        params.set('pageId', pageId+1);
                        nextLink.href = location.pathname + '?' + params.toString();
                        nextLink.textContent = "下一页";
                        nextLink.style.marginLeft = "10px";
                        nextLink.style.color = "#088";
                        pagination.appendChild(nextLink);
                    }
                    
                    document.body.appendChild(pagination);
                }
                
                let h2p = document.createElement("ul");
                h2p.id = "h2u";
                h2p.position = "absolute";
                h2p.style.display = "table";
                h2p.style.color = "#230de5";
                h2p.style.listStyle = 'decimal';
                h2p.style.paddingTop = "0";
                h2p.style.paddingBottom = "25px";
                document.body.append(h2p);
                ttls.forEach((it, n) => {
                    console.log(n + 1,it);
                    let ulli = document.createElement("li");
                    let plink = document.createElement("a");
                    plink.href = "https://www.ximalaya.com/sound/" + alt[n];
                    plink.target = "_blank";
                    plink.style.color = "#088";
                    plink.style.fontSize = "20px";
                    plink.textContent = String(n + 1).concat(".") + it;
                    ulli.append(plink);
                    document.querySelector("#h2u").append(ulli);
                });
                document.close();
            }
        },2000);
    }

    //专辑页
    if (location?.pathname?.indexOf("/album/") == 0 && location?.hostname.indexOf("ximalaya.com") > 0 ) {
        let pagesize = 200;
        let pageId = 1;
        let ts = Date.now();
        let albumId = location.pathname.indexOf("/album/") == 0 ? location.pathname.split("/")[2] : "77545064";
        let isAsc = false; //是否先显示最近更新
        let xmbase = "https://mobile.ximalaya.com/mobile/v1/album/track/ts-" + ts;
        xmbase += "?albumId=" + albumId + "&device=android&isAsc=" + isAsc + "&isQueryInvitationBrand=true&pageId=" + pageId;
        xmbase += "&pageSize=" + pagesize + "&pre_page=0";
        let xmly = xmbase;
        location.href = xmly;
    }
    //移动版分享视图
    if (location?.pathname?.indexOf("/selfshare/album") == 0 && location?.hostname == "m.ximalaya.com") {
        window.location.href = "https://m.ximalaya.com/album/" + location.pathname.split("/")[3];
    }
})();