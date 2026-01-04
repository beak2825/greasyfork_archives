// ==UserScript==
// @name         Remove Ad from M3U8
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拦截m3u8请求并移除其中插入的广告ts片段
// @author       
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506872/Remove%20Ad%20from%20M3U8.user.js
// @updateURL https://update.greasyfork.org/scripts/506872/Remove%20Ad%20from%20M3U8.meta.js
// ==/UserScript==



(function() {
    'use strict';
    let processingM3U8 = false;

    async function fixAdM3u8Ai(m3u8_url, headers = null){
              let ts = new Date().getTime();
              let option = headers ? {headers: headers} : {};

              function b(s1, s2) {
                let i = 0;
                while (i < s1.length) {
                  if (s1[i] !== s2[i]) {
                    break
                  }
                  i++
                }
                return i;
              }

              function reverseString(str) {
                return str.split('').reverse().join('');
              }

              //log('播放的地址：' + m3u8_url);
              const m3u8_response = await fetch(m3u8_url, option);
              let m3u8 =await m3u8_response.text();
              //log('m3u8处理前:' + m3u8);
              m3u8 = m3u8.trim().split('\n').map(it => it.startsWith('#') ? it : urljoin(m3u8_url, it)).join('\n');
              //log('m3u8处理后:============:' + m3u8);
              // 获取嵌套m3u8地址
              m3u8 = m3u8.replace(/\n\n/gi, '\n'); //删除多余的换行符
              let last_url = m3u8.split('\n').slice(-1)[0];
              if (last_url.length < 5) {
                last_url = m3u8.split('\n').slice(-2)[0];
              }

              if (last_url.includes('.m3u8') && last_url !== m3u8_url) {
                m3u8_url = urljoin(m3u8_url, last_url);
                // console.log('嵌套的m3u8_url:' + m3u8_url);
                const m3u8_nest_response = await fetch(m3u8_url, option);
                m3u8 = await m3u8_nest_response.text();
              }
              //log('----处理有广告的地址----');
              let s = m3u8.trim().split('\n').filter(it => it.trim()).join('\n');
              let ss = s.split('\n');
              //找出第一条播放地址
              //let firststr = ss.find(x => !x.startsWith('#'));
              let firststr = '';
              let maxl = 0;//最大相同字符
              let kk = 0;
              let kkk = 2;
              let secondstr = '';
              for (let i = 0; i < ss.length; i++) {
                let s = ss[i];
                if (!s.startsWith("#")) {
                  if (kk == 0) firststr = s;
                  if (kk == 1) maxl = b(firststr, s);
                  if (kk > 1) {
                    if (maxl > b(firststr, s)) {
                      if (secondstr.length < 5) secondstr = s;
                      kkk = kkk + 2;
                    } else {
                      maxl = b(firststr, s);
                      kkk++;
                    }
                  }
                  kk++;
                  if (kk >= 20) break;
                }
              }
              if (kkk > 30) firststr = secondstr;
              let firststrlen = firststr != null ? firststr.length : null
              //log('字符串长度：' + firststrlen);
              let ml = Math.round(ss.length / 2).toString().length; //取数据的长度的位数
              //log('数据条数的长度：' + ml);
              //找出最后一条播放地址
              let maxc = 0;
              let laststr = ss.toReversed().find((x) => {
                if (!x.startsWith('#')) {
                  let k = b(reverseString(firststr), reverseString(x));
                  maxl = b(firststr, x);
                  maxc++;
                  if (firststrlen - maxl <= ml + k || maxc > 10) {
                    return true;
                  }
                }
                return false;
              });
              // console.log('最后一条切片：' + laststr);
              //log('最小相同字符长度：' + maxl);
              let ad_urls = [];
              for (let i = 0; i < ss.length; i++) {
                let s = ss[i];
                if (!s.startsWith('#')) {
                  if (b(firststr, s) < maxl) {
                    ad_urls.push(s); // 广告地址加入列表
                    ss.splice(i - 1, 2);
                    i = i - 2;
                  } else {
                    ss[i] = urljoin(m3u8_url, s);
                  }
                } else {
                  ss[i] = s.replace(/URI=\"(.*)\"/, 'URI="' + urljoin(m3u8_url, '$1') + '"');
                }
              }
              // console.log('处理的m3u8地址:' + m3u8_url);
              // console.log('----广告地址----');
               console.log(ad_urls);
              m3u8 = ss.join('\n');
              //log('处理完成');
              //console.log('处理耗时：' + (new Date().getTime() - ts).toString());
              return m3u8;
     }


     function resolve (from, to){
      const resolvedUrl = new URL(to, new URL(from, 'resolve://'));
      if (resolvedUrl.protocol === 'resolve:') {
        const { pathname, search, hash } = resolvedUrl;
        return pathname + search + hash;
      }
      return resolvedUrl.href;
    };


     function urljoin (fromPath, nowPath){
       fromPath = fromPath || '';
       nowPath = nowPath || '';
       return resolve(fromPath, nowPath);
    };

    function playm3u8(urlm3,playerElement) {
        if (Hls.isSupported()) {

            var hls = new Hls();
            hls.loadSource(urlm3);
            hls.attachMedia(playerElement);
            //video.play();
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                playerElement.play();
            });
            hls.on(Hls.Events.ERROR, (event, data) => {
                //console.log("1222");
                console.log(event, data);
                // 监听出错事件
            });
        }
    }


    function replacePlayerSource(playerElement, newSource) {

        // 假设播放器使用 <video> 或类似标签

        if (playerElement) {
            playm3u8(newSource,playerElement)

        } else {

            console.warn('Player element not found.');

        }

    }

    const originalXhrOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url) {

        if (url.endsWith('.m3u8')) {
            this.addEventListener('load', async function() {

                if (!processingM3U8 && (this.responseType === '' || this.responseType === 'text')) {
                    processingM3U8 = true;
                    const m3u8_content = await fixAdM3u8Ai(url);
                    processingM3U8 = false;

                    // 创建 Blob 并生成 URL

                    const blob = new Blob([m3u8_content], { type: 'text/plain' });
                    const newM3u8Url = URL.createObjectURL(blob);
                    // 替换播放器源
                    const player = document.querySelector('video'); // 根据实际情况调整选择器
                    replacePlayerSource(player,newM3u8Url);

                }

            });

        }

        originalXhrOpen.apply(this, arguments);

    };



})();


