// ==UserScript==
// @name         Allen's Magic
// @namespace    https://tampermonkey.net/
// @version      4.0.7
// @description  Allen's magic casting to internet
// @author       @Amormaid
// @run-at       document-end
// @match        http://*/*
// @include      http://*
// @include      https://*
// @exclude      http://localhost*
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32519/Allen%27s%20Magic.user.js
// @updateURL https://update.greasyfork.org/scripts/32519/Allen%27s%20Magic.meta.js
// ==/UserScript==




function main() {
    // console.log('document.cookie', document.cookie)
    // document.cookie = document.cookie + 'hhhhhhhhhhhhhhhhhhhhhhh';
    // console.log('document.cookie after', document.cookie)
  // var root = document.body;
//   var hostname = /\d+\.\d+\.\d+\.\d+/.test(window.location.hostname) ? "ip": window.location.hostname;
  var hostname = window.location.hostname;

  if (exclude_check(hostname)) {
    return
  }

  // console.clear();

  try {
    console.time("allen_web_time_count");

    // customer change
    let rule = customer_rule(hostname)
    rule && rule.action()

    // content_purge(main_ele)

    console.timeEnd("allen_web_time_count");
  } catch(err) {
    //console.log(err.name,' ',err.message);
    console.log(err.message);
  }
}

//  white list check
function exclude_check(hostname_param) {
  // 不执行脚本的网站白名单
  let exclude_list = [
      "www.youtube.com",
      "demo.mycodes.net",
      "kiwivm.64clouds.com",
      "www.instagram.com",
      "www.h-ui.net",
      "www.layui.com",
      "www.kixeye.com",
      "pan.baidu.com",
      "www.rishiqing.com",
      "wx.qq.com",
      "mail.126.com",
      "twitter.com",
      "reactjs.org",
      "codepen.io",
      "free.modao.cc",
      "lanhuapp.com",
      "developers.weixin.qq.com",
      // "jira.vankeservice.com",
      "www.tapd.cn",
      "modao.cc",
      "element-cn.eleme.io",
      "github.com",
      ""
  ]
  return exclude_list.includes(hostname_param)
}

// 自定义样式调整
function customer_rule(hostname) {
  let rules = [
    {
      rule: "default",
      hostname: "ip",
      regexp: "",
      action: () => {}
    },
    {
      rule: "default",
      hostname: "ikkedu.com",
      regexp: "",
      action: async () => {
        //if (!parseQuery()['download']) {
        //    return
        //}
        const TYPE = parseQuery()['type'] || 'default'
        // // use MutationObserver instead of waiting react-based-rending elments complete
        const MO = new MutationObserverClass({window: window})

		if (['RA'].includes(TYPE)) {
			const RA_HOT = []

			MO.start({
			  // element: document.getElementById('app'),
			  selector: '.essayText.dictionary-word',
			  fn: async function (){
				await sleep(500)
				const title = _$('#topinfosTitle').innerText
				const id = _$('.tip-span.tip0').innerText
				const text = _$('.essayText.dictionary-word').innerText
				console.table({title, id, text})
				if (title && id && text) {
					RA_HOT.push({title, id, text})
				} else {
					alert(id)
				}
				const next_button = Array.from(document.querySelectorAll('.v-tooltip.v-tooltip--top button')).find(ele => ele.innerText == '下一题')

				if (next_button) {
					next_button.click()
				} else {
					const handler = (acc, cur) => {
						return `${acc}\r\n\r\n${cur.id } ${cur.title}\r\n${cur.text}`
					}
					window.RA_HOT = RA_HOT
					// var a = window.RA_HOT.reduce(handler, '')
					MO.stop();
				}
			  }
			});
		}

		if (['RL', 'SST'].includes(TYPE)) {
			MO.start({
			  // element: document.getElementById('app'),
			  selector: '.tip-span.tip0',
			  fn: async function (ele){
				console.log('control_btn ele', ele)
				// const control_btn = document.querySelector('.control-btn')
				// console.log('control_btn ', control_btn)
				// control_btn && control_btn.click()
				await sleep(1000)
				const play_icon = document.querySelector('.play-ctr-btn .material-icons')
				console.log('play_icon ', play_icon)
				play_icon && play_icon.click()
			  }
			});
			MO.start({
			  // element: document.getElementById('app'),
			  selector: '.v-snack__content',
			  fn: async function (ele){
				console.log('v-snack__content ele', ele)
				const next_button = Array.from(document.querySelectorAll('.v-tooltip.v-tooltip--top button')).find(ele => ele.innerText == '下一题')
				ele && next_button && next_button.click()
			  }
			});
			MO.start({
			  // element: document.getElementById('app'),
			  selector: '.waveform audio',
			  fn: async function (){
				const audio_mp3 = document.querySelector('.waveform audio')
				console.log('audio_mp3', audio_mp3)
				if (audio_mp3) {
					audio_mp3.preload = 'none'
					// console.log('audio_mp3', audio_mp3)
					const RS_mp3_id = document.querySelector('.tip-span.tip0').innerText
					// console.log('RS_mp3_id', RS_mp3_id)
					const src = audio_mp3.src
					downloadFile({ filePath: src, fileName: RS_mp3_id})
					await sleep(4 * 1000)
				}
				const next_button = Array.from(document.querySelectorAll('.v-tooltip.v-tooltip--top button')).find(ele => ele.innerText == '下一题')
				// next_button && next_button.click()
				if (next_button) {
					next_button.click()
				} else {
					MO.stop();
				}
			  }
			});
		}

        (['RS', 'ASQ'].includes(TYPE)) && MO.start({
            // element: document.getElementById('app'),
            selector: '.waveform audio',
            fn: async function (){
              const audio_mp3 = document.querySelector('.waveform audio')
              console.log('audio_mp3', audio_mp3)
              if (audio_mp3) {
                  audio_mp3.preload = 'none'
                  // console.log('audio_mp3', audio_mp3)
                  const RS_mp3_id = document.querySelector('.tip-span.tip0').innerText
                  // console.log('RS_mp3_id', RS_mp3_id)
                  const src = audio_mp3.src
                  downloadFile({ filePath: src, fileName: RS_mp3_id})
                  await sleep(1000)
              }
              const next_button = Array.from(document.querySelectorAll('.v-tooltip.v-tooltip--top button')).find(ele => ele.innerText == '下一题')
              // next_button && next_button.click()
				if (next_button) {
					next_button.click()
				} else {
					MO.stop();
				}
          }
        });

        let interval_id = setInterval(() => {
            if (window.frames.length) {
                // window.frames[0].style.display = 'none'
                document.getElementsByTagName('iframe')[0].style.display = 'none'
                // clearInterval(interval_id)
            }
        }, 500)
      }
    },
    {
      rule: "default",
      hostname: "jira.vankeservice.com",
      regexp: "",
      action: () => {
        if (window.location.href !== 'http://jira.vankeservice.com/browse/COST-1330') {
		// if (window.location.href !== 'http://jira.vankeservice.com/browse/COST-1068') {
        // if (window.location.href !== 'http://jira.vankeservice.com/browse/COST-677') {
        // if (window.location.href !== 'http://jira.vankeservice.com/browse/COST-863') {
			console.log('不是项目页，不能填工时')
			return
		}
		// await sleep(3000)
		console.clear()
		async function log_time() {
			try {
                // 44449 朴韵运维
                // 42572 朴韵开发
                // 43581 朴寓开发
                // 45003 朴寓商业平台对接
                const taskId = '45003' // 商业平台对接
                const comment = '编写代码'
				// const workInfoRes = await getData('http://jira.vankeservice.com/rest/tempo-time-activities/1/issue/42572/?page=1&size=5&activityType=all&currentUser=true')
                const workInfoRes = await getData(`http://jira.vankeservice.com/rest/tempo-time-activities/1/issue/${taskId}/?page=1&size=5&activityType=all&currentUser=true`)
				console.log('getData res', workInfoRes)
				const {activities = []} = workInfoRes || {}
				const time_list = activities.map(e => e.dateTime.slice(0, 10))
				const now = new Date()
				const time_now_string = `${now.getFullYear()}-${('0' + (now.getMonth() + 1)).slice(-2)}-${now.getDate()}`
				const today_not_log = !time_list.includes(time_now_string)
				const today_should_log = isWorkDay()
				const can_log_work_time = today_should_log && today_not_log
				if (can_log_work_time){
					const begin_time = `${getFormatDate(Date.now())}T09:00:27.792`
					const end_time = `${getFormatDate(Date.now())}T11:00:27.792`
					const data = {
						"attributes":{},
						"billableSeconds":"",
						"worker":"xiecy08",
						"comment":comment,
						"started":begin_time,
						"timeSpentSeconds":28800,
						"originTaskId":taskId,
						"remainingEstimate":0,
						"endDate":end_time
					}
                    postData('http://jira.vankeservice.com/rest/tempo-timesheets/4/worklogs/', data)
					setTimeout(() => {
						window.location.href = window.location.href
					}, 3 * 1000)
					return true
				}
				return false
			} catch (e) {
				window.location.href = window.location.href
			}
		}
		log_time()
		window.intervalId = setInterval(log_time, 1 * 3600 * 1000)
      }
    },
    {
      rule: "default",
      hostname: "wc-kx-vip.sjc.kixeye.com",
      regexp: "",
      action: () => {
        _$_('#above-game-message', 'remove_one');
        _$_('#kxp-footer-bar', 'remove_one');
        _$_('#topnavbar_back', 'remove_one');
      }
    },
    {
      rule: "default",
      hostname: ["www.baidu.com", "zhidao.baidu.com"],
      regexp: "",
      action: () => {
        let interval_id = setInterval( () => {
          const right_list_length = 5
          _$_("#content_right", 'remove_all');
          var zhidao_body = _$_("#body", "return_one");
          var container = _$_("#container", "return_one");
          var head = _$_("#head", "return_one");
          var pad = _$_("#s_tab", "return_one");
          _$_("#rs", "remove_all")
          var u = _$_("#u", "return_one");
          container.style.cssText = "display:block;width:100%;position:relative;"
          head && (() =>  {
            head.style.position = 'relative';
            head.style.width = window.innerWidth - 100 + 'px';
            head.style['min-width'] = 0;
          })();
          pad && (() =>  {
            pad.style.padding = '0 0 0 121px'
          })();
          u && (() =>  {
            u.style.display = 'none'
          })();
          zhidao_body && (() =>  {
            zhidao_body.style.left = "50px"
          })();

          let origin_length = document.getElementById("content_left").children.length

          if (origin_length > 6) {
            // console.log(content_list)
            let right_list = Array.prototype.slice.call(_$_(".result", "return_all"),-1 - right_list_length, -1)
            let container_r = document.createElement("div")
            container_r.style.cssText += "display:block;position:absolute;top:40px;left:740px;width:600px;"
            // let str = Array.prototype.reduce.call(right_list, (html_str, item ,index , right_list) => (item.innerHTML + html_str), '')
            Array.prototype.forEach.call(right_list, item => {
              item.style.cssText += "padding:10px 0;"
              container_r.appendChild(item)
            })
            let container_r_dom = container.appendChild(container_r)
            let page_indic = _$_("#page", "return_one")
            page_indic.style.cssText = "position:absolute;top:0px;left:660px;margin:-60px 0 0 0;z-index:300"
          }

        },300)
      }
    },
    {
      rule: "default",
      hostname: ["i.taobao.com", "trade.taobao.com", "rate.taobao.com", "buyertrade.taobao.com"],
      regexp: "",
      action: () => {
        _$_(".m-guess-you-like", "remove_one");
        _$_(".m-someone-like-you", 'remove_one');
        _$_("#p4p_ad", 'remove_one');
        _$_(".J_guess-you-like", 'remove_one');
      }
    },
    {
      rule: "default",
      hostname: "login.m.taobao.com",
      regexp: "",
      action: () => {
			setInterval(() => {
				document.querySelector('button[type=submit]').click()
			}, 1 * 1000)
      }
    },
	{
      rule: "default",
      hostname: "main.m.taobao.com",
      regexp: "",
      action: () => {
		autoRefresh(5)
      }
    },
    {
      rule: "default",
      hostname: "h5.m.taobao.com",
      regexp: "",
      action: () => {
		console.log(1)
        const path = window.location.pathname
		if (path === "/trip/rx-flight-onsale/listing/index.html") {
			setTimeout(() => {
				window.location.href = window.location.href
			}, 5 * 60 * 60 * 1000)
			setTimeout(() => {
				var btn = Array.from(_$_('span','return_all')).filter(e => e.innerText == '搜索')[0].parentNode;
				console.log('btn', btn)
				var event = document.createEvent('Events');
				event.initEvent('tap', true, true);
				btn.dispatchEvent(event);
			}, 1000)
		}
      }
    },
    {
      rule: "default",
      hostname: "m.ctrip.com",
      regexp: "",
      action: () => {
		setTimeout(() => {
			_$$('.pop-button-content').forEach(ele => ele.click())
		}, 1000)


		window.setIntervalId = setInterval(() => {
			let Iknow = document.querySelector('.pop-button-ghost')
			if (Iknow) {
				Iknow.click()
				clearInterval(window.setIntervalId)
			}
		}, 1 * 1000)
      }
    },
	{
      rule: "default",
      hostname: "iot.asmiot.com",
      regexp: "",
      action: () => {
		autoRefresh(5)
		window.clickIntervalId = setInterval(() => {
			let btn = _$_('#znjc')[0]
			console.log(btn)
			if (btn) {
				btn.click()
				clearInterval(window.clickIntervalId)
			}
		},5000)
      }
    },
	{
      rule: "default",
      hostname: "mail.126.com",
      regexp: "",
      action: () => {
		autoRefresh(5)
      }
    },
    {
      rule: "default",
      hostname: ["www.cnblogs.com", "blog.csdn.net"],
      regexp: "",
      action: () => {
        _$_('.btn-close', 'return_one').click();
        _$_('#btn-readmore', 'return_one').click();
        _$_('.recommend-box', 'remove_one')
        let main = _$_('main', 'return_one')
        document.body.style.backgroundImage = 'none';
        document.body.style.color = '#fff'
        document.body.innerHTML = ''
        // document.body.style.cssText = 'background-image: "none" ;'
        document.body.appendChild(main)
        main.style.cssText = 'width: 900px; float: left; margin: 0 auto 0 120px;'

        console.log('dasdasda is ', _$_('p', 'return_all'))
        Array.from(_$_('p', 'return_all')).forEach(e => e.style.color = '#fff')

        /*
        setTimeout(() => {
          _$_('aside', 'remove_one')
          _$_(".adblock", "remove_one");
        },2000)

        var content = _$_("#content", "return_one");
        _$_("#sidebar", "remove_one");
        _$_("#side", 'remove_one');

        content && (() =>  {
          content.style["margin-right"] = "10";
          content.style.width = window.innerWidth - 100 + 'px';
        })();

        let article = _$_("#article_content", "return_one");
        article && (() => {
          article.style.height = "100%";
          article.style.overflow = "visible";
        })()
        _$_(".recommend-item-box", "remove_all");
        _$_(".hide-article-box", "remove_one");
        _$_("aside", "remove_one");
        let main = _$_("main", "return_one")
        if (main) main.style.float = "left";
        setTimeout(() => {
          _$_(".adblock", "remove_one");
        },
        3000)
        _$_(".pulllog-box", "remove_one");
        */
      }
    },
    {
      rule: "default",
      hostname: "www.xyzssr.xyz",
      regexp: "",
      action: () => {
		setTimeout(() => {
			let check = document.getElementById('checkin')
			console.log('check', check)
			if (check) {
				check.click()
				window.open('https://www.google.com')
			}
			// window.open("about:blank","_self").close()

		}, 3000)


      }
    },
    {
      rule: "default",
      hostname: "www.w3school.com.cn",
      regexp: "",
      action: () => {
        _$_("#navsecond", 'hide_one');
      }
    },
    {
      rule: "default",
      hostname: "wallstreetcn.com",
      regexp: "",
      action: () => {
        setInterval(() =>  {
          _$_('.news-item__cover', 'remove_all');
          _$_('.qn-img', 'remove_all');
          //  console.log(new Date() - 0)
          change_style();
        },
        500);

        let main = _$_('main', 'return_one');
        document.body.innerHTML = '';
        document.body.appendChild(main);

        _$_('.left-bar', 'remove_one');
      }
    },
    {
      rule: "default",
      hostname: "www.merriam-webster.com",
      regexp: "",
      action: () => {
        _$_(".right-rail", 'hide_one');
        _$_("#recirc-bar-footer", 'hide_one');
        _$_(".wgt-related-to.jc-card-box.clearfix", 'hide_one');
      }
    },
    {
      rule: "default",
      hostname: "blog.sina.com.cn",
      regexp: "",
      action: () => {
        _$_("#column_1", 'hide_one');
      }
    },
    {
      rule: "default",
      hostname: ["blog.jobbole.com", "web.jobbole.com"],
      regexp: "",
      action: () => {
        _$_("#sidebar", 'hide_one');
        var grid = _$_(".grid-8", 'return_one');
        grid && (() =>  {
          grid.style.width = "100%"
        })();
      }
    },
    {
      rule: "default",
      hostname: "juejin.im",
      regexp: "",
      action: () => {
        var interval_id = setInterval(() =>  {
          var a = _$_(".show-full", 'return_one');
          var b = _$_(".show-full-block", 'return_one');
          _$_(".show-full-btn", 'remove_one');
          _$_('.columen-view-aside', 'hide_one');

          if (a) a.style.height = "auto";
          a && a.setAttribute('style', 'height:auto')
          if (b) {
            clearInterval(interval_id);
            b.setAttribute('style', 'height:auto')
          }
        },
        100);
        setInterval(change_style, 300)
      }
    },
    {
      rule: "default",
      hostname: "www.cnblogs.com",
      regexp: "",
      action: () => {
        _$_("#sideBar", 'hide_one');
        _$_("#vid", 'hide_one');
        _$_("#left", 'hide_one');
        _$_("#right_content", 'hide_one');
        _$_("#leftcontent", 'hide_one');
        var a = _$_("#centercontent", 'return_one');
        if (a) {
          a.style['padding-left'] = 0;
        }
      }
    },
    {
      rule: "default",
      hostname: "github.com",
      regexp: "",
      action: () => {
        document.body.style.minWidth = '100px';
        var github_pad = document.querySelector('.column.three-fourths.codesearch-results.pr-6');
        if (github_pad) {
          github_pad.style.padding = '10px 0 10px 30px';
        }
      }
    },
    {
      rule: "default",
      hostname: "wiki.jikexueyuan.com",
      regexp: "",
      action: () => {
        _$_(".detail-left", 'hide_one');
        var a = _$_(".detail-main", 'no_option', 'one');
        a.style['margin-left'] = '0px';
        a.style.width = document.body.clientWidth + 'px';
      }
    },
    {
      rule: "default",
      hostname: "www.cssmoban.com",
      regexp: "",
      action: () => {
        var a = _$_(".wide-main.col-media-main.clearfix", 'return_one');
        a.style.width = document.body.clientWidth + 'px';
      }
    },
    {
      rule: "default",
      hostname: "www.kancloud.cn",
      regexp: "",
      action: () => {
        var interval_id = setInterval(() =>  {
          var a = _$_(".sidebar", 'return_one');
          if (a) {
            _$_(".workspace", 'return_one').style.left = "180px";
            a.style.width = '180px';
            change_style(a);
            clearInterval(interval_id);
          }
        },
        100);
      }
    },
    {
      rule: "default",
      hostname: "php.net",
      regexp: "",
      action: () => {
        _$_('.layout-menu', 'remove_one');
        if (_$_(".sect1", 'return_one')) _$_(".sect1", 'return_one').style.width = document.body.clientWidth - 50 + "px";
        if (_$_("#usernotes", 'return_one')) _$_("#usernotes", 'return_one').style.width = document.body.clientWidth - 50 + "px";
      }
    },
    {
      rule: "default",
      hostname: "www.zhihu.com",
      regexp: "",
      action: () => {
        _$_('.Question-sideColumn.Question-sideColumn--sticky', 'remove_one');
        _$_('.AdblockBanner-inner', 'remove_one');
        _$_('.QuestionHeader-side', 'remove_all');
        _$_('.AppHeader-userInfo', 'remove_all');

        var browser_width = document.body.clientWidth - 50 + "px";
        _$_('.QuestionHeader-content', 'return_one').style.width = browser_width;

        setInterval(() =>  {
          _$_('.HitQrcode', 'remove_one');
        },
        100);
      }
    },
    {
      rule: "default",
      hostname: "www.letscorp.net",
      regexp: "",
      action: () => {
        _$_('#commentlist', 'remove_one');
        _$_('#sidebar', 'remove_one');
        _$_('#header', 'remove_one');

        var browser_width = document.body.clientWidth - 50 + "px";
        _$_('#container', 'return_one').style.width = browser_width;
        _$_('#main', 'return_one').style.height = "auto";
        var p_ele = _$_('p', 'return_all');
        Array.prototype.forEach.call(p_ele,
        function(e) {
          e.style["font-size"] = "16px";
        });
      }
    },
    {
      rule: "default",
      hostname: "segmentfault.com",
      regexp: "",
      action: () => {
        _$_("#loginBanner", "remove_one");
      }
    },
    {
      rule: "default",
      hostname: "huziketang.mangojuice.top",
      regexp: "",
      action: () => {
        for (var i = 0; i < 10000; i++) {
          clearInterval(i);
        }-
        _$_("div", "return_all").forEach(function(ele) {
          if (ele.id && ele.id !== "wrapper" && ele.id !== "uyan_frame" && ele.id !== "donate-mask") {
            ele.parentNode.removeChild(ele);
          }
        });
      }
    },
    {
      rule: "default",
      hostname: "jandan.net",
      regexp: "",
      action: () => {
          // html 调色
          let _html = _$_('html', 'return_one')
          let _body = _$_('body', 'return_one')
          _html.style.backgroundColor = '#333'
          _body.style.backgroundColor = '#333'
          // 去掉某些ID的发图
          let title_list = document.querySelectorAll("[title^=防伪码]")
          let block_user_list = ["42c968079f1cc3495692a053f432e105142a3142"]
          Array.prototype.forEach.call(title_list, (titleDOM) => {
              let author_id = titleDOM.title.replace(/[\u4e00-\u9fa5]{3}：/, '') // 装B正则
              if (block_user_list.includes(author_id)) {
                  let remove_div = titleDOM.parentNode.parentNode.parentNode.parentNode
                  remove_div.parentNode.removeChild(remove_div)
              }
          })
      }
    },
    {
      rule: "default",
      hostname: "www.sogou.com",
      regexp: "",
      action: () => {
          // html 调色
          console.log('sdasdasda')
          let id;
          id = setInterval(() => {
            let right = _$_("#right", "return_one");
              if (right) {
                  _$_("#right", "remove_one");
                  clearInterval(id)
              }
          }, 300);
      }
    },
    {
      rule: "default",
      hostname: "10.0.74.227",
      regexp: "",
      action: () => {
          setTimeout( _ => {
              let title_list = document.querySelectorAll(".opblock-tag")
              Array.prototype.forEach.call(title_list, (titleDOM) => {
                  titleDOM.click()
              })
          }, 10 * 1000)
      }
    },
  ]


  let matched_rule = rules.filter( rule_item => rule_item.hostname instanceof Array
    ? rule_item.hostname.includes(hostname)
    : rule_item.hostname === hostname
  )[0]

  return matched_rule
}



// --------------------- DOM function --------------------------------
//寻找页面的主要内容
function main_ele_searcher() {
  let article = document.getElementsByTagName('article')
  let main = document.getElementsByTagName('main')
  let content = (article.length && article[0]) || (main.length && main[0]) || false
  if (content) {
    return {
      main_ele: content,
      body_width: content.style.width,
      body_height: content.style.height
    };
  }

  var ele = document.querySelectorAll("*");
  var arr = [];
  //var  arr_index = [];
  var w, h;

  var body_width = document.body.clientWidth;
  var body_height = document.body.clientHeight;

  if (!body_height) {
      var max_width = 0, max_height = 0;
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';

      for (let i = 0, ele_length = ele.length; i < ele_length; i++) {
          w = ele[i].clientWidth;
          h = ele[i].clientHeight;
          if (w > max_width) { max_width = w; }
          if (h > max_height) { max_height = h; }
          w = null;
          h = null;
      }
      body_width = max_width;
      body_height = max_height;
  }


  for (let i = 0, ele_length = ele.length; i < ele_length; i++) {
      w = ele[i].clientWidth;
      h = ele[i].clientHeight;
      //console.log(h);

      if (w && h && w > body_width / 2 && h > body_height / 5 && w < body_width && h < body_height) {
          arr[w * h] = ele[i];
          //console.log(ele[i]);
          //arr_index.push(w * h);
      }
      w = null;
      h = null;
  }
  var main_ele = arr[arr.length - 1] || document.body;
  return {
      main_ele,
      body_width,
      body_height
  };
}

function content_purge() {
  let article = document.getElementsByTagName('article')
  let main = document.getElementsByTagName('main')
  let content = (article.length && article[0]) || (main.length && main[0]) || false;
  if (content) {
    main.style.cssText = 'width: 900px;margin: 40px 0 0 120px;float: left; ';
    document.body.innerHTML = '';
    document.body.appendChild(main);
  }

  // main.parentNode.removeChild(main)
  // Array.from(document.body.children)
  // document.body.insertBefore(main, document.body.firstChild);

}

//去除侧边栏这样“狭长”的内容
function ele_remover(obj) {
    var w, h;
    var { main_ele, body_width, body_height } = obj;
    var ele = document.querySelectorAll("*");
    //console.log(main_ele,body_width, body_height )
    for (let i = 0, ele_length = ele.length; i < ele_length; i++) {
        w = ele[i].clientWidth;
        h = ele[i].clientHeight;
        //  main_ele.parentNode.children
        if (!ele[i].contains(main_ele) && !main_ele.contains(ele[i]) && (ele[i] !== main_ele) && w * 1.4 < h && w < body_width / 2 && w > body_width / 10) {
            //content_adjust(ele[i]);
            console.log("---------element   removed ------------");
            console.log(ele[i]);
            console.log("---------element   removed ------------");

            ele[i].parentNode.removeChild(ele[i]);
        }
        w = null;
        h = null;
    }
}

//去除被移除元素的兄弟元素的padding  margin
function content_adjust(ele) {
    var siblings = ele.parentNode.children;
    ele.parentNode.style.position = "relative";
    // console.log(ele);
    for (let i = 0, ele_length = siblings.length; i < ele_length; i++) {
        //console.log(siblings[i]);
        siblings[i].setAttribute('style', 'position:relative;padding:20px;margin:0px;overflow:visible;');
    }
}

//调整主要内容的样式
function main_content_adjust(main_ele) {
    //var a = [{x,y,top,right,bottom,left,width}]=main_ele.getClientRects();
    main_ele.parentNode.style.position = "relative";
    main_ele.style.cssText = "position:absolute; top:0;right:0; bottom:0;left:0;"
    // main_ele.setAttribute('style','position:relative;padding:20px 20px 20px 40px;margin:auto;clear:both;overflow:visible;');
    var ratio = 0.9 * (window.innerWidth) / main_ele.clientWidth;
    var ele = main_ele.querySelectorAll('*');
    // console.log(ele);
    for (let i = 0, ele_length = ele.length; i < ele_length; i++) {
        ele[i].style.width = ele[i].clientWidth * ratio + "px";
        ele[i].style.overflow = 'visible';
        //console.log(i);
    }

}

// body 全屏
function full_body() {
  let root = document.body
  root.style.cssText = "position:absolute; top:0;right:0; bottom:0;left:0;"

}

//背景调色
function change_style(DOM_node = document.body) {
    return
    //  执行速度 ：  for 循环 > forEach > 尾递归 >递归 (迭代)
    let background_base_color = 50;
    let background_offset = 20;
    let font_base_color = 230;
    let font_offset = 20;
    var all = (DOM_node  || document).querySelectorAll('*');
    for (let i = 0, ele_length = all.length; i < ele_length; i++) {
        let item = all[i]
        let item_style = item.style
        let tag_exclude_check = !('script,style,img').includes(item.nodeName.toLowerCase())
        if(tag_exclude_check && !item_style.backgroundColor){
            item_style.backgroundColor =  random_color(background_base_color,background_offset);
            item_style.color =  random_color(font_base_color,font_offset);
        }
    }
}

function random_color(base_color, offset, ratio=1){
    base_color = (base_color & 255) === (~~base_color) ? ~~base_color : 255;
    offset = ~~offset
    offset = (base_color+offset > 0 && base_color+offset < 256)? offset : 0
    return `rgba(${(base_color + offset*Math.random())&255},${(base_color + offset*Math.random())&255},${(base_color + offset*Math.random())&255},0.8)`;
}

function ele_hide(e) {
    // if (document.body.hasChildNodes(e)) e.style.display = "none";
    document.body.hasChildNodes(e) && e.length !== 0 && e.style.setAttribute('display', "none");
}
function ele_hide_all(all) {
    Array.prototype.forEach.call(all, function (e) { e.style.display = "none"; });
}
function ele_remove(e) {
    // if (document.body.hasChildNodes(e)) e.parentNode.removeChild(e);
    e = e.length ? e[0] : e
    document.body.hasChildNodes(e) && e.length !== 0 && e.parentNode.removeChild(e);
}
function ele_remove_all(all) {
    if (all) {
        all = Array.from(all)
    }
    if (!all.length) {
        return
    }
    Array.prototype.forEach.call(all, function (e) {
        e instanceof Object && e.parentNode.removeChild(e);
    });
}

function _$_(selector, operation_code) {
    // operation_code  : return_one return_all remove_one remove_all hide_one hide_all
    function get(selector) {
        if((/^#[^.#]+$/).test(selector)) {
           return [document.getElementById(selector.slice(1, selector.length))]
        }
        if((/^\.[^.#]+$/).test(selector)) {
           return document.getElementsByClassName(selector.slice(1, selector.length))
        }
        if((/^[^.#\[\]=]+$/).test(selector)) {
           return document.getElementsByTagName(selector)
        }
		return document.querySelectorAll(selector)
    }
    switch (operation_code) {
        case 'return_one': //return_one
            // return document.querySelector(selector);
            return get(selector)[0];
        case 'return_all':// return_all
            // return document.querySelectorAll(selector);
            return get(selector);
        case 'remove_one':  //remove_one
            // ele_remove(document.querySelector(selector));
            ele_remove(get(selector));
            break;
        case 'remove_all': //remove_all
            // ele_remove_all(document.querySelectorAll(selector));
            ele_remove_all(get(selector));
            break;
        case 'hide_one': //hide_one
            // ele_hide(document.querySelector(selector));
            ele_hide(get(selector));
            break;
        case 'hide_all':// hide_all
            // ele_hide_all(document.querySelectorAll(selector));
            ele_hide_all(get(selector));
            break;

        default:
            // JQuery like
            var result = get(selector);
            result.remove = function(){ele_remove(this)} // ele_remove() only delete one or the first of the list
            return result
            // return result.length > 1 ? result : result[0];
    }
}

function _$() {
	return document.querySelector.apply(document, arguments)
}
function _$$() {
	return Array.from(document.querySelectorAll.apply(document, arguments))
}

function _CSS(DOM_ele, pseudo_class) {
   return pseudo_class ? window.getComputedStyle(DOM_ele, pseudo_class) : window.getComputedStyle(DOM_ele)
}

function revert_color(color) {
  const [red, blue, green, alpha] = color.match(/\d{1,3}/g);
  return Number(alpha) ? `rgba(${255 - red}, ${255 - blue}, ${255 - green}, ${alpha})` : `rgb(${255 - red}, ${255 - blue}, ${255 - green})`;
}

function remove_div_padding_margin(ele) {
    if (ele) {
        ele.setAttribute('style', 'overflow:visible;position:relative;padding:0px;margin:0px;left:0px;');
    }
    if (ele && ele.children.length > 0) {
        Array.prototype.forEach.call(ele.children, (function (e) {
            remove_div_padding_margin(e);
        }));
    }
}

// -----------------------  utils  -------------------------------
function sleep(ms = 1500) {
	return new Promise(resolve => setTimeout(_ => resolve(), ~~ms))
}

function autoRefresh(minute = 5) {
	let time = parseFloat(minute) || 5
	window.setTimeOutId = ''
	window.addEventListener('offline', function(e) { clearTimeout(window.setTimeOutId); });
	window.addEventListener('online', function(e) {
		window.location.href = window.location.href;
	});
	window.setTimeOutId = setTimeout(() => {
		if (window.navigator.onLine) {
			window.location.href = window.location.href
		}
	}, time * 60 * 1000)
}

function getFormatDate(date) {
  let year = new Date(date).getFullYear()
  let month = new Date(date).getMonth() + 1
  let day = new Date(date).getDate()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  return [year, month, day].join('-')
}

function isWorkDay(){
	// should update national_holiday  national_workday every year after official notice
	const national_holiday = [
		'2020-04-04',
		'2020-04-05',
		'2020-04-06',
		'2020-05-01',
		'2020-05-02',
		'2020-05-03',
		'2020-05-04',
		'2020-05-05',
		'2020-06-25',
		'2020-06-26',
		'2020-06-27',
		'2020-10-01',
		'2020-10-02',
		'2020-10-03',
		'2020-10-04',
		'2020-10-05',
		'2020-10-06',
		'2020-10-07',
		'2020-10-08'
	]
	const national_workday = [
		'2020-04-26',
		'2020-05-09',
		'2020-06-28',
		'2020-09-27',
		'2020-10-10'
	]
	if (national_holiday.includes(getFormatDate(Date.now()))) {
		return false
	}
	if (national_workday.includes(getFormatDate(Date.now()))) {
		return true
	}
	const day_week = new Date(Date.now()).getDay()
	if (day_week === 0 || day_week === 6) {
		return false
	} else {
		return true
	}
}

function postData(url, data) {
	const opts = {
	  method: 'POST', // 请求方法
	  body: JSON.stringify(data), // 请求体
	  headers: {
		accept: 'application/json',
		'content-type': 'application/json'
	  },
	  mode: 'cors'
	}
	return fetch(url, opts)
	  .then(response => {
		return response.json()
	  })
	  .then(resp => {
		return resp
		// return Promise.reject(resp)
	  })
}

function getData(url) {
	const opts = {
	  method: 'GET', // 请求方法
	  mode: 'cors'
	}
	return fetch(url, opts)
	  .then(response => {
		return response.json()
	  })
	  .then(resp => {
		return resp
		// return Promise.reject(resp)
	  })
}

function content_get() {
    var ajax = new XMLHttpRequest();
    ajax.open('get', '/');
    ajax.send();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            content_new = ajax.responseText;
            //console.log(content_new);
            content_old = content_old || content_new;
            if (content_new !== content_old) {
                location.reload();
            }
        }
    };

    setTimeout(content_get, 1000);
}

function downloadFile(paramObj){
    let {filePath, fileName} = paramObj instanceof Object ? paramObj : {}
    if (!filePath) return;
    const randomName = Math.random().toString(32).slice(2);
    const matchArr = filePath.match(/[^./?]+\.[a-zA-Z0-9]+(?=$|\?.*)/g) || []
    const defaultName = matchArr[0]
    fetch(filePath).then(res => res.blob()).then(blob => {
      const a = document.createElement('a');
      document.body.appendChild(a)
      a.style.display = 'none'
      // 使用获取到的blob对象创建的url
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      // 指定下载的文件名
      a.download = fileName || defaultName || randomName;
      a.click();
      document.body.removeChild(a)
      // 移除blob对象的url
      window.URL.revokeObjectURL(url);
    });
}
function parseQuery () {
  const hastPare = window.location.hash.match(/[^?&=]+\=[^?&=]+/g) || []
  return hastPare.reduce((acc, ele) => {
    const [key, val] = ele.split('=')
    acc[key] = val
    return acc
  }, {})
}

function openConsole () {
	var event = document.createEvent('Events');
	event.keyCode = 100;
	event.initEvent('keypress', true, true);
	$0.dispatchEvent(event);
}

class MutationObserverClass {
    constructor({window}) {
        this.window = window
        this.listeners = [];
        this.observer = undefined
    }

    start({element, selector, fn}) {
      // 储存选择器和回调函数
      this.listeners.push({
        element,
        selector,
        fn
      });
      if(!this.observer){
        // 监听document变化
        let MutationObserver = this.window.MutationObserver || this.window.WebKitMutationObserver;
        let check = this.check.bind(this)
        this.observer = new MutationObserver(check);
        this.observer.observe(this.window.document.documentElement, {
          childList: true,
          subtree: true
        });
      }
      // 检查该节点是否已经在DOM中
      this.check();
    }

	// 重置监听器上的计数
	reset() {
      this.listeners.forEach(listener => {
        // 检查指定节点是否有匹配
        let element = listener.element || this.window.document.querySelector(listener.selector)
        element.called  = undefined
      })
	}

	stop() {
		this.observer.disconnect()
	}

    check(){
      //   console.log('check this', this)
      // 检查是否匹配已储存的节点
      this.listeners.forEach(listener => {
        // 检查指定节点是否有匹配
        let element = listener.element || this.window.document.querySelector(listener.selector)
        let isSelf = element instanceof HTMLElement && element === this.window.document.querySelector(listener.selector)

		// 监听节点的子节点变化，也会触发父节点的回调
		// 当父节点的回调触发后，将其flag置为true
		// 有些情况下，在下一个监听开始前，需要reset监听
		if (isSelf) {
          const called = ele => ele.called = true
		  // console.log('called(element)', element.called)
		  // console.log('element instanceof HTMLElement', element instanceof HTMLElement)
          element instanceof HTMLElement && !element.called && called(element) && listener.fn.call(element, element);
        } else {
          element instanceof HTMLElement && called(element) && listener.fn.call(element, element);
        }

      })
    //   for(let i = 0; i < this.listeners.length; i++){

    //     // let listener = this.listeners[i];
    //     // // 检查指定节点是否有匹配
    //     // let element = listener.element || this.window.document.querySelector(listener.selector)
    //     // if (!element) {
    //     //     return
    //     // }
    //     // element instanceof HTMLDivElement && listener.fn.call(element, element);
    //     // console.log('elements', elements)
    //     // for(let j = 0; j < elements.length; j++){
    //     //     let element = elements[j];
    //     //     console.log('element', element)
    //     //   // 确保回调函数只会对该元素调用一次
    //     //   if(!element.ready){
    //     //     element.ready = true;
    //     //     // 对该节点调用回调函数
    //     //     listener.fn.call(element, element);
    //     //   }
    //     // }
    //   }
    }
}




//  ---------------------------------- main  -------------------------------------

main()