// ==UserScript==
// @name         哔哩哔哩猜你喜欢
// @version      1.2
// @description  哔哩哔哩猜你喜欢!
// @author       MyFaith
// @match        http://*.bilibili.com/*
// @match        https://*.bilibili.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require      https://cdn.bootcss.com/axios/0.19.0-beta.1/axios.min.js
// @run-at       document-end
// @namespace https://greasyfork.org/users/8899
// @downloadURL https://update.greasyfork.org/scripts/375185/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/375185/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2.meta.js
// ==/UserScript==

/**
 * 基于Chrome插件版 哔哩哔哩猜你喜欢改写，原仓库地址
 * https://github.com/chitosai/bili-guessYouLike
 */

var $ = $ || window.$;
window.jQuery = $;
window.HTTP = axios;

const UI = {
    isIndex(){
        let path = window.location.pathname;
        if( path == '/' || path == '/index.html' ) {
            return true
        } else {
            return false;
        }
    },
    isVideo() {
		let path = window.location.pathname;
		if( path.indexOf('video/av') > -1 ) {
			return true;
		} else {
			return false;
		}
    },
    insertRecommands() {
		// 复制「动画」模块来做一个「猜你喜欢」
		let douga = document.querySelector('#bili_douga');
		let node = douga.cloneNode(true);
		node.id = '_bili_guessyoulike';
		// 替换文本内容
		let name = node.querySelector('.name');
		name.href = 'javascript: null;';
		name.textContent = '猜你喜欢';
		// 修改结构
		let text = node.querySelector('.bili-tab');
		text.innerHTML = '';
		text.style.margin = '3px 0 0 0';
		text.style.color = '#ccc';
		let rank = node.querySelector('.sec-rank');
		rank.innerHTML = '';
		rank.style.width = '80px';
		rank.style.height = '530px';
		rank.style.background = '#f0f0f0';
		let more = node.querySelector('.link-more');
		// 创建一个「换一换」按钮
		let btn = document.createElement('div');
		btn.classList.add('read-push');
		btn.style.marginLeft = '-5px';
		btn.innerHTML = '<i class="icon icon_read"></i><span class="info">换一批</span>';
		// 点这个按钮就通知插件换一批推荐视频
		btn.addEventListener('click', () => {
			window.postMessage({
				type: 'UPDATE_RECOMMANDS'
			}, '*');
		});
		more.insertAdjacentElement('afterend', btn);
		more.remove();
		// 扩大左边
		node.querySelector('.new-comers-module').style.width = 'calc(100% - 80px)';
		// 插入页面
		let ref = document.querySelector('#chief_recommend');
		ref.insertAdjacentElement('afterend', node);
		return node;
    },
    updateRecommands(videos) {
		let node = document.querySelector('#_bili_guessyoulike') || UI.insertRecommands();
		// 移除原有的视频
		let stage = node.querySelector('.storey-box');
		stage.style.height = '486px';
		let html = '';
		if( videos.length ) {
			function toWan(number) {
				return number > 9999 ? ((number/10000).toFixed(1) + '万') : number;
			}
			// 插入新视频
			videos.forEach((video) => {
				let v = `<div class="spread-module"><a href="/video/av${video.aid}/" target="_blank"><div class="pic"><div class="lazy-img"><img src="${video.pic}@160w_100h.webp"></div></div><p title="${video.title}" class="t">${video.title}</p><p class="num"><span class="play"><i class="icon"></i>${toWan(video.stat.view)}</span><span class="danmu"><i class="icon"></i>${toWan(video.stat.danmaku)}</span></p></a></div>`;
				html += v;
			});
		} else {
			html = '<p style="color: #777; line-height: 486px; text-align: center;">观看记录为空，快去看几个视频吧~</p>';
		}
		stage.innerHTML = html;
    },
    listen() {
		window.addEventListener('message', (ev) => {
			if( ev.data.type && ev.data.type == 'UPDATE_RECOMMANDS' ) {
				RECOMMAND.recommand(20);
			}
		});
	}
}

const DB = {
	local: {
        get(key, callback) {
            let value = localStorage.getItem(key) || ''
            if(value && key !== 'history' && key !== 'count') value = JSON.parse(value)
            callback(value)
        },
        set(obj) {
            if(obj) {
                for(let key in obj) {
                    localStorage.setItem(key, JSON.stringify(obj[key]))
                }
            }
        },
        remove(key) {
            localStorage.removeItem(key)
        }
    },
	get(key, cb) {
        if(typeof key == 'object') {
           key = key[0]
        }
        DB.local.get(key, (data) => {
            if(typeof data == 'string' && data) {
                data = JSON.parse(data)
            }
            cb(data)
            /* if( typeof(key) == 'string' ) {
			    typeof(cb) == 'function' && cb(data[key]);
    		} else {
	    		typeof(cb) == 'function' && cb(data);
		   	} */
        });
	},
	set(obj, cb) {
		DB.local.set(obj, cb);
	},
	remove(key) {
		DB.local.remove(key);
	},
	saveRecommands(aid, videos) {
		let obj = {};
		obj[aid] = videos;
		DB.set(obj);
		DB.recommandsCountAdd(videos.length);
	},
	recommandsCountAdd(delta) {
		DB.get('count', (_c) => {
			let count = _c || 0;
			count += delta;
			DB.set({count});
		});
	},
	logUserViewHistory(aid) {
		DB.getUserViewHistory((history) => {
			history.unshift(aid);
			// 保持访问记录最多99条
			if( history.length > 99 ) {
				let removedId = history.pop();
				// 如果被删除的aid在之后的记录中没有再次访问，那么删除这个aid对应的推荐视频
				if( !history.includes(removedId) ) {
					DB.get(removedId, (v) => {
						DB.remove(removedId);
						DB.recommandsCountAdd(-v.length);
					});
				}
			}
			DB.set({history});
		});
	},
	getUserViewHistory(cb) {
		DB.get('history', (history) => {
			cb(history || []);
		});
	}
}

const RECOMMAND = {
	// 获取av号对应的推荐视频
	get(aid) {
		DB.get(aid, (videos) => {
			if( !videos ) {
				// 没有获取过推荐视频要去服务端获取
				HTTP.get(`https://comment.bilibili.com/recommendnew,${aid}`, { responseType: 'json' }).then((raw) => {
                    let res;
                    res = raw.data
					// 去掉我们不需要的信息，节约存储空间..
					let data = res.data.map((v) => {
						return {
							aid: v.aid,
							title: v.title,
							pic: v.pic,
							stat: v.stat
						}
					});
					// 保存到数据库
					DB.saveRecommands(String(aid), data);
				});
			}
		});
	},
	// 根据当前用户访问记录获取n个随机推荐视频
	recommand(n) {
		DB.getUserViewHistory((vh) => {
			let max = Math.min(12, vh.length); // 只根据最近观看的12个视频来生成推荐
            let keys = vh.slice(0, max);
			DB.get(keys, (recommandArray) => {
				let allVideos = recommandArray;
				/* keys.forEach((key) => {
					allVideos = allVideos.concat(recommandArray[key]);
				}); */
				let max = Math.min(allVideos.length, n);
				let ids = [], videos = [];
				while( ids.length < max ) {
					let i = Math.floor(Math.random() * allVideos.length);
					const v = allVideos[i];
					if( !ids.includes(v.aid) ) {
						ids.push(v.aid);
						videos.push(v);
					}
				};
				UI.updateRecommands(videos);
			});
		});
	}
}

$(document).ready(function(){
    if( UI.isIndex() ) {
        RECOMMAND.recommand(20);
        UI.listen();
    }

    if( UI.isVideo() ) {
        let url = window.location.href,
            m = /\/av(\d+)/.exec(url);
        if( m ) {
            let aid = m[1];
            DB.logUserViewHistory(aid);
            RECOMMAND.get(aid);
        } else {
            console.error(`找不到av号：${url}`);
        }
    }
});
