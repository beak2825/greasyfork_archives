// ==UserScript==
// @name         iconfont图标集合下载器
// @namespace    https.com.github.shenjingmayi
// @version      1.0
// @description  自动获取整个iconfont集合的完整图标包，目前仅支持图标，不支持3D等其他类型。
// @author       sjmy
// @match        *://www.iconfont.cn/collections/detail*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.2.2/dist/jszip.min.js  
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527015/iconfont%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527015/iconfont%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const createControlPanel = () => {
        const panel = document.createElement('div');
        GM_addStyle(`
            #sjmy-dl-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 9999;
                background: rgba(255,255,255,0.0);
				padding: 10px !important;
				min-width: 150px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            #sjmy-dl-btn {
                background: #1890ff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s;
				padding: 6px 12px !important;
				font-size: 13px !important;
				width: auto !important;
				box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
            #sjmy-dl-btn:disabled {
                background: #8c8c8c;
                cursor: not-allowed;
            }
			#sjmy-dl-btn:after {
				content: '';
				display: inline-block;
				margin-left: 8px;
				width: 8px;
				height: 8px;
				border-radius: 50%;
			}
			#sjmy-dl-btn[disabled]:after {
				background: #ff4d4f;
			}
			#sjmy-dl-btn:not([disabled]):after {
				background: #52c41a;
			}
        `);
        panel.id  = 'sjmy-dl-panel';
        return panel;
    };
    const sanitizeFilename = (name) => {
        return name.replace(/[\\/:"*?<> |]/g, '_');
    };
    const createAuthorLinkFile = (creator) => {
        const content = [
            '[InternetShortcut]',
            `URL=https://www.iconfont.cn/user/detail?userViewType=collections&uid=${creator.id}&nid=${creator.nid}`
        ].join('\n');
        return {
            name: `作者主页-${sanitizeFilename(creator.nickname)}.url`,
            content: content
        };
    };
    const createCollectionInfoFile = (data, cid) => {
        const meta = data.collection;
        const creator = data.creator  || {};
        const infoContent = [
            `集合链接：https://www.iconfont.cn/collections/detail?cid=${cid}`,
            `集合名称：${meta.name  || '未命名集合'}`,
            `作者：${creator.nickname  || '匿名作者'}`,
            `作者简介：${(creator.bio  || '暂无简介').replace(/\n/g, ' ')}`,
            `集合内图片数量：${meta.icons_count  || '未获取到信息'}`,
            `版权类型：${meta.copyright  === 'original' ? '原创' : '非原创'}`,
            `是否收费：${meta.fees  === 'free' ? '免费' : '付费'}`
        ].join('\n\n');
        return {
            name: '集合基本信息.txt',
            content: infoContent
        };
    };
    const main = async () => {
        const panel = createControlPanel();
        const btn = document.createElement('button');
        btn.id  = 'sjmy-dl-btn';
        btn.innerHTML  = '初始化中...';
        btn.disabled  = true;
        panel.appendChild(btn);
        document.body.appendChild(panel);
        try {
            const cid = new URLSearchParams(window.location.search).get('cid')  || location.pathname.split('/').pop();
            if (!cid) throw new Error('CID_NOT_FOUND');
            btn.innerHTML  = '准备下载';
            btn.disabled  = false;
            btn.onclick  = async () => {
                btn.innerHTML  = '获取数据中...';
                btn.disabled  = true;
                try {
                    const response = await fetch(`https://www.iconfont.cn/api/collection/detail.json?id=${cid}`);
                    if (!response.ok)  throw new Error('API_ERROR');
                    const { data } = await response.json();
                    const collectionName = sanitizeFilename(data.collection?.name  || `collection-${cid}`);
                    const feeStatus = data.collection?.fees  === 'free' ? '免费' : '付费';
                    const fileName = `${collectionName}-${feeStatus}`;
                    const zip = new JSZip();
                    data.icons.forEach((icon,  index) => {
                        zip.file(`${sanitizeFilename(icon.name  || `icon-${index}`)}.svg`, icon.show_svg);
                    });
                    if (data.creator)  {
                        const authorFile = createAuthorLinkFile(data.creator);
                        zip.file(authorFile.name,  authorFile.content);
                    }
                    const infoFile = createCollectionInfoFile(data, cid);
                    zip.file(infoFile.name,  infoFile.content);
                    btn.innerHTML  = '打包中...';
                    const content = await zip.generateAsync({  type: 'blob' });
                    const link = document.createElement('a');
                    link.download  = `${fileName}.zip`;
                    link.href  = URL.createObjectURL(content);
                    link.click();

                    btn.innerHTML  = '下载完成✔';
                    setTimeout(() => {
                        btn.innerHTML  = '重新下载';
                        btn.disabled  = false;
                    }, 2000);
                } catch (e) {
                    console.error('[ 下载器错误]', e);
                    btn.innerHTML  = `失败: ${e.message}`;
                    setTimeout(() => {
                        btn.innerHTML  = '重试下载';
                        btn.disabled  = false;
                    }, 2000);
                }
            };
        } catch (e) {
            btn.innerHTML  = '初始化失败';
            console.error('[ 初始化错误]', e);
        }
    };
    if (typeof JSZip !== 'undefined') {
        main();
    } else {
        window.addEventListener('load',  main);
    }
})();