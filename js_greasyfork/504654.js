// ==UserScript==
// @name         m3u8 downloader
// @description  m3u8 downloader tool
// @version      0.1.10
// @author       wen
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/combine/npm/streamsaver@2,npm/mux.js@6/dist/mux-mp4.min.js,npm/hls.js@1,npm/vue@2
// @license      MIT
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/504654/m3u8%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/504654/m3u8%20downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.self != window.top) {
    return;
  }

  const oldOpen = XMLHttpRequest.prototype.open;

  const ajaxSend = (url, options) => {
    options = options || {};
    options.url = url;

    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      if (options.type === 'file') {
        xhr.responseType = 'arraybuffer';
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          let status = xhr.status;
          if (status >= 200 && status < 300) {
            // options.success && options.success(xhr.response);
            resolve(xhr.response);
          } else {
            // options.fail && options.fail(status);
            reject(status);
          }
        }
      };

      xhr.onerror = reject;
      // xhr.open('GET', options.url, true);
      oldOpen.call(xhr, 'GET', options.url, true);
      xhr.send(null);
    });
  };

  const createApp = (u) => {
    if (document.querySelector('#m3u8_download_app')) {
      return;
    }

    console.log('createApp');

    GM_addStyle(
      `#m3u8_download_app [v-cloak]{display:none}#m3u8_download_app .float-button{overflow:hidden;display:flex;align-items:center;justify-content:center;background-color:red;border-radius:2px;font-size:9px;padding:0 4px;color:#fff;cursor:pointer;box-sizing:border-box;box-shadow:0 0 10px 0 rgba(0,0,0,0.2)}#m3u8_download_app .app-main{display:flex;flex-direction:column;gap:.5rem;height:30vh;max-width:40vw;min-width:25rem;padding:.25rem 1rem 1rem;box-sizing:border-box;font-size:14px;overflow-x:hidden;overflow-y:scroll;border:1px solid rgba(0,0,0,0.4);box-shadow:0 0 10px 0 rgba(0,0,0,0.2);border-radius:.25rem;background-color:#fff;color:#333}#m3u8_download_app .app-main section,#m3u8_download_app .app-main label,#m3u8_download_app .app-main p{padding:0;margin:0}#m3u8_download_app .app-main button{display:block;color:white;cursor:pointer;border-radius:4px;border:1px solid #eeeeee;background-color:#3d8ac7;opacity:1;transition:.3s all;padding:.25rem .5rem;white-space:nowrap}#m3u8_download_app .app-main button:hover{opacity:.9}#m3u8_download_app .app-main .text-inputs{display:flex;align-items:stretch;gap:.5rem}#m3u8_download_app .app-main input.text-input,#m3u8_download_app .app-main .text-inputs>input{display:block;padding:.25rem;border-radius:4px;box-shadow:none;color:#444444;border:1px solid #cccccc;flex:none;background-color:transparent}#m3u8_download_app .app-main .w-90px{width:90px}#m3u8_download_app .app-main .flex-auto{flex:auto}#m3u8_download_app .app-main .flex-none{flex:none}#m3u8_download_app .app-main :disabled{cursor:not-allowed;background-color:#dddddd}#m3u8_download_app .app-main>header{display:flex;align-items:center}#m3u8_download_app .app-main>header .title{flex:auto;text-align:center;font-weight:bold;padding-left:1.5rem}#m3u8_download_app .app-main>header .close{flex:none;font-size:12px;color:#444444;text-decoration:none}#m3u8_download_app .app-main>header .close:hover{opacity:.5}#m3u8_download_app .app-main>main{display:flex;flex-direction:column;gap:1rem}#m3u8_download_app .app-main>main .form-field{display:flex;flex-direction:column;gap:.5rem}#m3u8_download_app .app-main>main .form-field>label{font-weight:bold;display:flex;align-items:center;gap:.5rem}#m3u8_download_app .app-main>main .form-field>label>sub,#m3u8_download_app .app-main>main .form-field>label>sup{font-weight:normal;color:#ccc;vertical-align:middle}#m3u8_download_app .app-main>main .form-field>.radios>label{display:inline-flex;align-items:center;gap:.25rem}#m3u8_download_app .app-main>main .form-field>.radios,#m3u8_download_app .app-main>main .form-field>.buttons{display:flex;flex-wrap:wrap;align-items:stretch;gap:.5rem}#m3u8_download_app .app-main>footer{border-top:1px dotted gray;display:flex;flex-direction:column;gap:.5rem;padding:.5rem 0}#m3u8_download_app .app-main>footer ul.segments{text-align:left;display:flex;flex-wrap:wrap;gap:.5rem;margin:0;padding:0;list-style:none}#m3u8_download_app .app-main>footer ul.segments>li{margin:0;padding:0;list-style:none;display:block;color:white;font-size:12px;width:32px;height:32px;line-height:32px;text-align:center;border-radius:4px;cursor:help;border:solid 1px #eeeeee;background-color:#dddddd;transition:.3s all}#m3u8_download_app .app-main>footer ul.segments>li.finish{background-color:#0acd76}#m3u8_download_app .app-main>footer ul.segments>li.error{cursor:pointer;background-color:#dc5350}#m3u8_download_app .app-main>footer ul.segments>li.error:hover{opacity:.6}#m3u8_download_app .app-main .tips{width:100%;color:#999999;text-align:left;font-style:italic;word-break:break-all}#m3u8_download_app .app-main .tips.error{color:#dc5350}`
    );

    let $section = document.createElement('section');
    $section.innerHTML = `<div id="m3u8_download_app"><section class="app-main" v-cloak v-if="showPanel" style="display: none"><header><div class="title">{{completed?'下载完成':tips}}</div><a class="close" href="#" @click.prevent="()=>showPanel=false">[隐藏]</a></header><main><section class="form-field"><label>M3U8链接</label><input type="text" v-model="url" :disabled="downloading" @input="preDownload" placeholder="请输入 m3u8 链接" class="text-input" /></section><section class="form-field"><label>文件名</label><span>{{ filename}}</span></section><section class="form-field"><label>下载格式</label><span class="radios"><label><input type="radio" v-model="download_format" value="mp4" :disabled="downloading" /><span>MP4</span></label><label><input type="radio" v-model="download_format" value="ts" :disabled="downloading" /><span>TS</span></label></span></section><section class="form-field"><label>下载方式 <sub>如果视频比较大，机器内存比较小，选择流式下载</sub></label><span class="radios"><label><input type="radio" v-model="download_method" value="direct" :disabled="downloading" /><span>直接下载</span></label><label><input type="radio" v-model="download_method" value="stream" :disabled="downloading" :disabled="!streamable()" /><span>流式下载</span></label></span></section><section class="form-field"><label>指定碎片范围</label><div class="text-inputs"><input type="number" v-model="rangeDownload.startSegment" :disabled="downloading||!rangeDownload.isShowRange" placeholder="起始" class="w-90px" /><input type="number" v-model="rangeDownload.endSegment" :disabled="downloading||!rangeDownload.isShowRange" placeholder="截止" class="w-90px" /></div></section><section class="form-field"><div><button @click="startDownload()" v-if="!downloading" :disabled="!ready">开始下载</button><button @click="togglePause()" v-if="downloading && !completed">{{ isPause ? '恢复下载' : '暂停下载'}}</button></div></section></main><footer v-if="finishList.length >0"><div class="tips">待下载碎片总量：{{ rangeDownload.targetSegment}}，已下载：{{ finishNum}}，错误：{{ errorNum}}，进度：{{ (finishNum / rangeDownload.targetSegment * 100).toFixed(2)}}%</div><ul class="segments"><li class="item" v-for="(item, index) in finishList" :class="item.status" :title="item.title" @click="retry(index)">{{ index + 1}}</li></ul><div class="tips" :class="[errorNum ? 'error' : '']">若某视频碎片下载发生错误，将标记为红色，可点击相应图标进行重试</div></footer></section><div class="float-button" v-if="!showPanel" @click="()=>showPanel=true" style="width: 32px; height: 32px">M3U8</div></div>`;
    $section.style.right = '1rem';
    $section.style.bottom = '1rem';
    $section.style.position = 'fixed';
    $section.style.zIndex = '9999';
    $section.style.display = 'none';
    document.body.appendChild($section);

    $section.querySelector('.app-main')?.style?.removeProperty('display');
    $section.style.removeProperty('display');

    new Vue({
      el: $section,

      data() {
        return {
          showPanel: false,

          url: u ?? '', // 在线链接
          download_format: 'mp4', // 下载格式
          download_method: this.streamable() ? 'stream' : 'direct', // 下载方式
          title: '', // 视频标题

          ready: false,

          tips: 'm3u8 视频提取工具', // 顶部提示
          isPause: false, // 是否暂停下载
          isGetMP4: false, // 是否转码为 MP4 下载

          durationSecond: 0, // 视频持续时长
          isShowRefer: false, // 是否显示推送
          downloading: false, // 是否下载中
          beginTime: '', // 开始下载的时间
          errorNum: 0, // 错误数
          finishNum: 0, // 已下载数
          downloadIndex: 0, // 当前下载片段
          finishList: [], // 下载完成项目
          tsUrlList: [], // ts URL数组
          mediaFileList: [], // 下载的媒体数组
          streamWriter: null, // 文件流写入器
          streamDownloadIndex: 0, // 文件流写入器，正准备写入第几个视频片段
          rangeDownload: {
            // 特定范围下载
            isShowRange: false, // 是否显示范围下载
            startSegment: 1, // 起始片段
            endSegment: NaN, // 截止片段
            targetSegment: 1, // 待下载片段
          },
          aesConf: {
            // AES 视频解密配置
            method: '', // 加密算法
            uri: '', // key 所在文件路径
            iv: '', // 偏移值
            key: '', // 秘钥
            decryptor: null, // 解码器对象

            stringToBuffer: function (str) {
              return new TextEncoder().encode(str);
            },
          },
        };
      },

      created() {
        setInterval(this.retryAll.bind(this), 2000); // 每两秒重新下载一遍错误片段，实现错误自动重试
        if (this.url) {
          this.preDownload();
        }
      },

      methods: {
        getDocumentTitle() {
          try {
            let title = document.querySelector('.videoName')?.innerText.trim();
            if (!title) {
              title = document.title;
            }
            if (!title) {
              title = window.top.document.title;
            }
            return (title ?? '')
              .replace(/[/\\?%*:|"<>]/g, '-')
              .replace(/-+/g, '-')
              .replace(/\s+/g, ' ');
          } catch (error) {
            console.log(error);
          }
          return '';
        },

        // 合成URL
        applyURL(targetURL, baseURL) {
          baseURL = baseURL || location.href;
          if (targetURL.indexOf('http') === 0) {
            // 当前页面使用 https 协议时，强制使 ts 资源也使用 https 协议获取
            if (location.href.indexOf('https') === 0) {
              return targetURL.replace('http://', 'https://');
            }
            return targetURL;
          } else if (targetURL[0] === '/') {
            let domain = baseURL.split('/');
            return domain[0] + '//' + domain[2] + targetURL;
          } else {
            let domain = baseURL.split('/');
            domain.pop();
            return domain.join('/') + '/' + targetURL;
          }
        },

        reset() {
          this.tsUrlList = [];
          this.finishList = [];
          this.rangeDownload.isShowRange = false;
          this.rangeDownload.endSegment = NaN;
          this.rangeDownload.targetSegment = NaN;
          this.ready = false;
        },

        preDownload() {
          this.tips = 'm3u8 视频提取工具';
          this.reset();
          if (this.url) {
            this.getM3U8(true);
          }
        },

        startDownload() {
          // 使用流式下载，边下载边保存，解决大视频文件内存不足的难题
          if (this.download_method === 'stream') {
            this.streamWriter = window.streamSaver.createWriteStream(`${this.filename}.${this.download_format}`).getWriter();
          }
          // 解析为 mp4 下载
          this.isGetMP4 = this.download_format === 'mp4';
          this.getM3U8();
        },

        // 获取在线文件
        async getM3U8(onlyGetRange) {
          this.tips = '正在检查 m3u8 链接';
          this.beginTime = new Date();
          this.reset();

          const m3u8Str = await ajaxSend(this.url);

          // 提取 ts 视频片段地址
          m3u8Str.split('\n').forEach((item) => {
            // if (/.(png|image|ts|jpg|mp4|jpeg)/.test(item)) {
            // 放开片段后缀限制，下载非 # 开头的链接片段
            if (/^[^#]/.test(item)) {
              this.tsUrlList.push(this.applyURL(item, this.url));
              this.finishList.push({
                title: item,
                status: '',
              });
            }
          });

          // 仅获取视频片段数
          if (onlyGetRange) {
            this.rangeDownload.isShowRange = true;
            this.rangeDownload.endSegment = this.tsUrlList.length;
            this.rangeDownload.targetSegment = this.tsUrlList.length;
            this.ready = true;
            this.tips = '等待下载';
            return;
          }

          let startSegment = Math.max(this.rangeDownload.startSegment || 1, 1); // 最小为 1
          let endSegment = Math.max(this.rangeDownload.endSegment || this.tsUrlList.length, 1);
          startSegment = Math.min(startSegment, this.tsUrlList.length); // 最大为 this.tsUrlList.length
          endSegment = Math.min(endSegment, this.tsUrlList.length);
          this.rangeDownload.startSegment = Math.min(startSegment, endSegment);
          this.rangeDownload.endSegment = Math.max(startSegment, endSegment);
          this.rangeDownload.targetSegment = this.rangeDownload.endSegment - this.rangeDownload.startSegment + 1;
          this.downloadIndex = this.rangeDownload.startSegment - 1;
          this.downloading = true;

          // 获取需要下载的 MP4 视频长度
          if (this.isGetMP4) {
            let infoIndex = 0;
            m3u8Str.split('\n').forEach((item) => {
              if (item.toUpperCase().indexOf('#EXTINF:') > -1) {
                // 计算视频总时长，设置 mp4 信息时使用
                infoIndex++;
                if (this.rangeDownload.startSegment <= infoIndex && infoIndex <= this.rangeDownload.endSegment) {
                  this.durationSecond += parseFloat(item.split('#EXTINF:')[1]);
                }
              }
            });
          }

          // 检测视频 AES 加密
          if (m3u8Str.indexOf('#EXT-X-KEY') > -1) {
            this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ['', '', ''])[2];
            this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ['', '', ''])[2];
            this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ['', '', ''])[2];
            this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : '';
            this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url);
            this.getAES();
          } else if (this.tsUrlList.length > 0) {
            // 如果视频没加密，则直接下载片段，否则先下载秘钥
            this.downloadTS();
          } else {
            this.alertError('资源为空，请查看链接是否有效');
          }

          // this.ajax({
          //   url: this.url,
          //   success: (m3u8Str) => {
          //     this.tsUrlList = [];
          //     this.finishList = [];

          //     // 提取 ts 视频片段地址
          //     m3u8Str.split('\n').forEach((item) => {
          //       // if (/.(png|image|ts|jpg|mp4|jpeg)/.test(item)) {
          //       // 放开片段后缀限制，下载非 # 开头的链接片段
          //       if (/^[^#]/.test(item)) {
          //         console.log(item);
          //         this.tsUrlList.push(this.applyURL(item, this.url));
          //         this.finishList.push({
          //           title: item,
          //           status: '',
          //         });
          //       }
          //     });

          //     // 仅获取视频片段数
          //     if (onlyGetRange) {
          //       this.rangeDownload.isShowRange = true;
          //       this.rangeDownload.endSegment = this.tsUrlList.length;
          //       this.rangeDownload.targetSegment = this.tsUrlList.length;
          //       this.ready = true;
          //       this.tips = '等待下载';
          //       return;
          //     }

          //     let startSegment = Math.max(this.rangeDownload.startSegment || 1, 1); // 最小为 1
          //     let endSegment = Math.max(this.rangeDownload.endSegment || this.tsUrlList.length, 1);
          //     startSegment = Math.min(startSegment, this.tsUrlList.length); // 最大为 this.tsUrlList.length
          //     endSegment = Math.min(endSegment, this.tsUrlList.length);
          //     this.rangeDownload.startSegment = Math.min(startSegment, endSegment);
          //     this.rangeDownload.endSegment = Math.max(startSegment, endSegment);
          //     this.rangeDownload.targetSegment = this.rangeDownload.endSegment - this.rangeDownload.startSegment + 1;
          //     this.downloadIndex = this.rangeDownload.startSegment - 1;
          //     this.downloading = true;

          //     // 获取需要下载的 MP4 视频长度
          //     if (this.isGetMP4) {
          //       let infoIndex = 0;
          //       m3u8Str.split('\n').forEach((item) => {
          //         if (item.toUpperCase().indexOf('#EXTINF:') > -1) {
          //           // 计算视频总时长，设置 mp4 信息时使用
          //           infoIndex++;
          //           if (this.rangeDownload.startSegment <= infoIndex && infoIndex <= this.rangeDownload.endSegment) {
          //             this.durationSecond += parseFloat(item.split('#EXTINF:')[1]);
          //           }
          //         }
          //       });
          //     }

          //     // 检测视频 AES 加密
          //     if (m3u8Str.indexOf('#EXT-X-KEY') > -1) {
          //       this.aesConf.method = (m3u8Str.match(/(.*METHOD=([^,\s]+))/) || ['', '', ''])[2];
          //       this.aesConf.uri = (m3u8Str.match(/(.*URI="([^"]+))"/) || ['', '', ''])[2];
          //       this.aesConf.iv = (m3u8Str.match(/(.*IV=([^,\s]+))/) || ['', '', ''])[2];
          //       this.aesConf.iv = this.aesConf.iv ? this.aesConf.stringToBuffer(this.aesConf.iv) : '';
          //       this.aesConf.uri = this.applyURL(this.aesConf.uri, this.url);
          //       this.getAES();
          //     } else if (this.tsUrlList.length > 0) {
          //       // 如果视频没加密，则直接下载片段，否则先下载秘钥
          //       this.downloadTS();
          //     } else {
          //       this.alertError('资源为空，请查看链接是否有效');
          //     }
          //   },
          //   fail: () => {
          //     this.alertError('链接不正确，请查看链接是否有效');
          //   },
          // });
        },

        // 获取AES配置
        async getAES() {
          // alert('视频被 AES 加密，点击确认，进行视频解码')
          try {
            const key = await ajaxSend(this.aesConf.uri, { type: 'file' });
            this.aesConf.key = key;
            this.aesConf.decryptor = new AESDecryptor();
            this.aesConf.decryptor.constructor();
            this.aesConf.decryptor.expandKey(this.aesConf.key);
            this.downloadTS();
          } catch (error) {
            this.alertError('视频已加密，且无法解密');
          }

          // this.ajax({
          //   type: 'file',
          //   url: this.aesConf.uri,
          //   success: (key) => {
          //     this.aesConf.key = key;
          //     this.aesConf.decryptor = new AESDecryptor();
          //     this.aesConf.decryptor.constructor();
          //     this.aesConf.decryptor.expandKey(this.aesConf.key);
          //     this.downloadTS();
          //   },
          //   fail: () => {
          //     this.alertError('视频已加密，且无法解密');
          //   },
          // });
        },

        // ts 片段的 AES 解码
        aesDecrypt(data, index) {
          let iv = this.aesConf.iv || new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, index]);
          return this.aesConf.decryptor.decrypt(data, 0, iv.buffer || iv, true);
        },

        // 下载分片
        async downloadTS() {
          this.tips = '正在下载视频碎片';
          const download = async () => {
            let isPause = this.isPause; // 使用另一个变量来保持下载前的暂停状态，避免回调后没修改
            let index = this.downloadIndex;
            if (index >= this.rangeDownload.endSegment) {
              return;
            }
            this.downloadIndex++;
            if (this.finishList[index] && this.finishList[index].status === '') {
              this.finishList[index].status = 'downloading';

              const file = await ajaxSend(this.tsUrlList[index], { type: 'file' });
              this.dealTS(file, index, () => this.downloadIndex < this.rangeDownload.endSegment && !isPause && download());

              // this.ajax({
              //   url: this.tsUrlList[index],
              //   type: 'file',
              //   success: (file) => {
              //     this.dealTS(file, index, () => this.downloadIndex < this.rangeDownload.endSegment && !isPause && download());
              //   },
              //   fail: () => {
              //     this.errorNum++;
              //     this.finishList[index].status = 'error';
              //     if (this.downloadIndex < this.rangeDownload.endSegment) {
              //       !isPause && download();
              //     }
              //   },
              // });
            } else if (this.downloadIndex < this.rangeDownload.endSegment) {
              // 跳过已经成功的片段
              !isPause && (await download());
            }
          };

          // 建立多少个 ajax 线程
          for (let i = 0; i < Math.min(6, this.rangeDownload.targetSegment - this.finishNum); i++) {
            await download();
          }
        },

        // 处理 ts 片段，AES 解密、mp4 转码
        dealTS(file, index, callback) {
          const data = this.aesConf.uri ? this.aesDecrypt(file, index) : file;
          this.conversionMp4(data, index, (afterData) => {
            // mp4 转码
            this.mediaFileList[index - this.rangeDownload.startSegment + 1] = afterData; // 判断文件是否需要解密
            this.finishList[index].status = 'finish';
            this.finishNum++;
            if (this.streamWriter) {
              for (let index = this.streamDownloadIndex; index < this.mediaFileList.length; index++) {
                if (this.mediaFileList[index]) {
                  this.streamWriter.write(new Uint8Array(this.mediaFileList[index]));
                  this.mediaFileList[index] = null;
                  this.streamDownloadIndex = index + 1;
                } else {
                  break;
                }
              }
              if (this.streamDownloadIndex >= this.rangeDownload.targetSegment) {
                this.streamWriter.close();
              }
            } else if (this.finishNum === this.rangeDownload.targetSegment) {
              this.downloadFile(this.mediaFileList, this.filename);
            }
            callback && callback();
          });
        },

        // 转码为 mp4
        conversionMp4(data, index, callback) {
          if (this.isGetMP4) {
            let transmuxer = new muxjs.Transmuxer({
              keepOriginalTimestamps: true,
              duration: parseInt(this.durationSecond),
            });
            transmuxer.on('data', (segment) => {
              if (index === this.rangeDownload.startSegment - 1) {
                let data = new Uint8Array(segment.initSegment.byteLength + segment.data.byteLength);
                data.set(segment.initSegment, 0);
                data.set(segment.data, segment.initSegment.byteLength);
                callback(data.buffer);
              } else {
                callback(segment.data);
              }
            });
            transmuxer.push(new Uint8Array(data));
            transmuxer.flush();
          } else {
            callback(data);
          }
        },

        // 暂停与恢复
        togglePause() {
          this.isPause = !this.isPause;
          !this.isPause && this.retryAll(true);
        },

        // 重新下载某个片段
        async retry(index) {
          if (this.finishList[index].status === 'error') {
            try {
              this.finishList[index].status = '';
              const file = await ajaxSend(this.tsUrlList[index], { type: 'file' });
              this.errorNum--;
              this.dealTS(file, index);
            } catch (error) {
              this.finishList[index].status = 'error';
            }

            // this.ajax({
            //   url: this.tsUrlList[index],
            //   type: 'file',
            //   success: (file) => {
            //     this.errorNum--;
            //     this.dealTS(file, index);
            //   },
            //   fail: () => {
            //     this.finishList[index].status = 'error';
            //   },
            // });
          }
        },

        // 重新下载所有错误片段
        retryAll(forceRestart) {
          if (!this.finishList.length || this.isPause) {
            return;
          }

          let firstErrorIndex = this.downloadIndex; // 没有错误项目，则每次都递增
          this.finishList.forEach((item, index) => {
            // 重置所有错误片段状态
            if (item.status === 'error') {
              item.status = '';
              firstErrorIndex = Math.min(firstErrorIndex, index);
            }
          });
          this.errorNum = 0;
          // 已经全部下载进程都跑完了，则重新启动下载进程
          if (this.downloadIndex >= this.rangeDownload.endSegment || forceRestart) {
            this.downloadIndex = firstErrorIndex;
            this.downloadTS();
          } else {
            // 否则只是将下载索引，改为最近一个错误的项目，从那里开始遍历
            this.downloadIndex = firstErrorIndex;
          }
        },

        // 下载整合后的TS文件
        downloadFile(fileDataList, fileName) {
          this.tips = '碎片整合中，请留意浏览器下载';
          let fileBlob = null;
          let a = document.createElement('a');
          if (this.isGetMP4) {
            // 创建一个Blob对象，并设置文件的 MIME 类型
            fileBlob = new Blob(fileDataList, { type: 'video/mp4' });
            a.download = fileName + '.mp4';
          } else {
            // 创建一个Blob对象，并设置文件的 MIME 类型
            fileBlob = new Blob(fileDataList, { type: 'video/MP2T' });
            a.download = fileName + '.ts';
          }
          a.href = URL.createObjectURL(fileBlob);
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
          a.remove();
        },

        // 强制下载现有片段
        forceDownload() {
          if (this.mediaFileList.length) {
            this.downloadFile(this.mediaFileList, this.filename);
          } else {
            alert('当前无已下载片段');
          }
        },

        // 发生错误，进行提示
        alertError(tips) {
          this.downloading = false;
          this.tips = tips;
        },

        nowFn() {
          const d = new Date();
          const now = (field) => {
            return (d['get' + field] + (field === 'Month' ? 1 : 0)).toString().padStart(2, '0');
          };
          return `${now('FullYear')}${now('Month')}${now('Date')}-${now('Hours')}${now('Minutes')}${now('Seconds')}`;
        },
        streamable() {
          return window.streamSaver && !window.streamSaver.useBlobFallback;
        },
      },

      computed: {
        completed() {
          return this.finishNum === this.rangeDownload.targetSegment && this.rangeDownload.targetSegment > 0;
        },
        urlTitle() {
          try {
            return this.url ? new URL(this.url).searchParams.get('title') : '';
          } catch (error) {
            return '';
          }
        },
        // 获取文件名
        filename() {
          return (this.urlTitle || this.getDocumentTitle() || this.nowFn())
            .replace(/[/\\?%*:|"<>]/g, '-')
            .replace(/-+/g, '-')
            .replace(/\s+/g, ' ');
        },
      },
    });
  };

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    if (url.includes('m3u')) {
      console.log('hookedOpen', url);
      if (document.body) {
        createApp(url);
      } else {
        const u = url;
        window.addEventListener('DOMContentLoaded', () => createApp(u));
      }
    }
    return oldOpen.call(this, method, url, async, user, password);
  };
})();
