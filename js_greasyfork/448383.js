// ==UserScript==
// @name         哔哩哔哩猜你喜欢
// @namespace    bili_guessyoulike
// @version      1.1.7
// @description  哔哩哔哩新版网页首页添加猜你喜欢模块
// @author       lock
// @homepageURL https://greasyfork.org/en/scripts/448383
// @homepage https://greasyfork.org/zh-CN/scripts/448383
// @match        https://www.bilibili.com/*
// @connect      app.bilibili.com
// @connect      passport.bilibili.com
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://cdn.staticfile.org/blueimp-md5/2.19.0/js/md5.min.js
// @require      https://cdn.staticfile.org/qrcodejs/1.0.0/qrcode.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448383/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/448383/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2.meta.js
// ==/UserScript==

const LOG_PREFIX = '[哔哩哔哩猜你喜欢]'

const moduleTemplate = `
	<div class="bili-grid no-margin">
		<div class="bangumi-activity-area">
			<div class="area-header">
				<div class="left">
					<a id="猜你喜欢" class="the-world area-anchor" data-id="2233"></a>
					<svg class="icon">
						<use xlink:href="#channel-douga"></use>
					</svg>
					<a class="title">
						<span>猜你喜欢</span>
					</a>
				</div>
				<div class="right">
          <span class="widescreen-button">
            <span class="txt">自动宽屏</span><span class="switch-button on"></span>
          </span>
          <span class="autoplay-button">
            <span class="txt">自动播放</span><span class="switch-button on"></span>
          </span>
          <button class="primary-btn login-qr-btn" style="">
            <span>扫码登录</span>
          </button>
          <span class="login_qr_btn_remind" style="display: none;"></span>
          <button class="primary-btn page-btn disable-button">
            <span>上一批</span>
            <svg><use xlink:href="#widget-arrow"></use></svg>
          </button>
					<button class="primary-btn roll-btn">
						<svg style="transform: rotate(0deg);">
							<use xlink:href="#widget-roll"></use>
						</svg>
						<span>换一换</span>
					</button>
				</div>
			</div>
			<div class="bangumi-activity-body">
			</div>
		</div>
	</div>`

// template string里用${}做标识是不是会直接被js转义掉。。我们就用!#{}来做标识好了
const videoCardTemplate = `
	<div class="bili-video-card">
		<div class="bili-video-card__skeleton hide">
			<div class="bili-video-card__skeleton--cover"></div>
			<div class="bili-video-card__skeleton--info">
				<div class="bili-video-card__skeleton--face"></div>
				<div class="bili-video-card__skeleton--right">
					<p class="bili-video-card__skeleton--text"></p>
					<p class="bili-video-card__skeleton--text short"></p>
					<p class="bili-video-card__skeleton--light"></p>
				</div>
			</div>
		</div>
		<div class="bili-video-card__wrap __scale-wrap">
			<a class="bili-video-card__ctnr" href="!#{bvurl}" target="_blank">
				<div class="bili-video-card__image">
					<div class="bili-video-card__image--wrap">
						<picture class="v-img bili-video-card__cover">
							<img src="!#{cover}@672w_378h_1c.webp" alt="!#{title}">
						</picture>
						<div class="v-inline-player"></div>
					</div>
					<div class="bili-video-card__image--mask">
						<div class="bili-video-card__stats">
							<div class="bili-video-card__stats--left">
								<span class="bili-video-card__stats--item">
									<svg class="bili-video-card__stats--icon">
										<use xlink:href="#widget-play-count"></use>
									</svg>
									<span>!#{view}</span>
								</span>
								<span class="bili-video-card__stats--item">
									<svg class="bili-video-card__stats--icon">
										<use xlink:href="#widget-agree"></use>
									</svg>
									<span>!#{like}</span>
								</span>
							</div>
							<span class="bili-video-card__stats__duration">!#{duration}</span>
						</div>
					</div>
				</div>
				<div class="bili-video-card__info __scale-disable">
					<a href="//space.bilibili.com/!#{uid}" target="_blank">
						<div class="v-avatar bili-video-card__avatar">
							<picture class="v-img v-avatar__face">
								<img src="!#{avatar}@72w_72h" alt="!#{username}">
							</picture>
						</div>
					</a>
					<div class="bili-video-card__info--right">
						<a href="!#{bvurl}" target="_blank">
							<h3 class="bili-video-card__info--tit" title="!#{title}">!#{title}</h3>
						</a>
						<p class="bili-video-card__info--bottom">
							<a class="bili-video-card__info--owner" href="//space.bilibili.com/!#{uid}" target="_blank">
								<span class="bili-video-card__info--author">!#{username}</span>
							</a>
						</p>
					</div>
				</div>
			</a>
		</div>
	</div>`

// 登录QR窗口
const loginQRTemplate = `
<style type="text/css">
  .bili-mini[data-v-720b4453-qr] {
    width: 820px;
    border-radius: 8px;
    -webkit-box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
    padding: 52px 65px 29px 92px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff;
    background-image: url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/22_open.72c00877.png),
      url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/33_open.43a09438.png);
    background-position: 0 100%, 100% 100%;
    background-repeat: no-repeat, no-repeat;
    background-size: 14%;
    position: relative;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
  }
  .bili-mini[data-v-720b4453-qr],
  .bili-mini-mask[data-v-720b4453-qr] {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .bili-mini-mask[data-v-720b4453-qr] {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 3000;
  }
  .bili-mini-close[data-v-720b4453-qr] {
    position: absolute;
    width: 18px;
    height: 18px;
    top: 20px;
    right: 20px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEgSURBVHgB7ddLCsIwEAbgSXqRepReQnAjuBJPJK4EN4KX8Cj2Im1NSldhYubVjc2/0BLJ5AObTAtQU/Nncdjg7fH6xO9xGLrL6dCDYa73Z+ub5h2vz8f9Lv3do7Om+XOeGAuAPaZd1gASaByHLkzoLVEJpp/XQOJ+FvChgAsFIBRQ/H0YJlfLFQspURxMEaRFcTEkkBQlwZBBXJQUwwJRURoMG1RCaTEiUA4Vx7UYMQhDLcMqjAqEoECLifGgjctcG5RjJb2Bl2otKNuM/KZGGqVF75Nt+8xusuh9/IOxsLW1KF7rIJ4zGhS9uTIPPSmK9vghPIElqPIDmrIdcFFuTYwE5dbGcFFo67DGxMQa6dsMujY6ewKwxKCoCWpqtpEvwlafLd9Y4QQAAAAASUVORK5CYII=)
      no-repeat;
    background-size: cover;
    cursor: pointer;
  }
  .bili-mini-content[data-v-720b4453-qr] {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  .bili-mini-content .bili-mini-line[data-v-720b4453-qr] {
    display: block;
    width: 1px;
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    height: 228px;
    background-color: #e7e7e7;
    margin: 46px 45px 0;
    z-index: 1;
  }
  .bili-mini-tab[data-v-720b4453-qr] {
    font-size: 18px;
    line-height: 20px;
    padding: 10px 14px;
    border-bottom: 5px solid #eee;
    cursor: pointer;
  }
  .active > .bili-mini-tab[data-v-720b4453-qr] {
    border-color: #00a1d6;
  }
  .bili-mini-bottom[data-v-720b4453-qr] {
    position: absolute;
    bottom: -28px;
    width: 100%;
  }
  .bili-mini-bottom_live[data-v-720b4453-qr] {
    position: relative;
    bottom: -10px;
    width: 100%;
  }
  .bili-mini-login-group[data-v-720b4453-qr] {
    position: relative;
  }
  .bili-mini-scan[data-v-4bb99a48-qr] {
    margin-top: 42px;
    position: relative;
  }
  .bili-mini-scan-top[data-v-4bb99a48-qr] {
    position: relative;
    z-index: 1;
  }
  .bili-mini-scan-qrcode[data-v-4bb99a48-qr] {
    margin-bottom: 18px;
    width: 173px;
    height: 173px;
    position: relative;
    cursor: pointer;
  }
  .bili-mini-scan-tv[data-v-4bb99a48-qr] {
    background: url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/tv.312d1af4.gif) 0 0 no-repeat;
    width: 70px;
    height: 70px;
    position: absolute;
    top: -65px;
    left: -8px;
    z-index: 9;
  }
  .bili-mini-scan-tips[data-v-4bb99a48-qr] {
    height: 173px;
    width: 330px;
    position: absolute;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    left: 50%;
    bottom: -7px;
  }
  .bili-mini-scan-description[data-v-4bb99a48-qr] {
    margin-bottom: 16px;
  }
  .bili-mini-scan-code[data-v-4bb99a48-qr],
  .bili-mini-scan-download[data-v-4bb99a48-qr],
  .bili-mini-scan-refresh[data-v-4bb99a48-qr],
  .bili-mini-scan-success[data-v-4bb99a48-qr] {
    position: absolute;
    top: 0;
    left: 0;
  }
  .bili-mini-scan-code[data-v-4bb99a48-qr] {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 173px;
    height: 173px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
  }
  .bili-mini-scan-download[data-v-4bb99a48-qr] {
    width: 173px;
    height: 173px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIwAAACMCAMAAACZHrEMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjMWE2MTM5Ny01ZDA0LTQ4NGItYWM2Yy1kOTA0YmM2OGY4NGUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUVDOTEzQTQ2MEREMTFFNUE0NEU5NzBFQkM5MzRDMjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUVDOTEzQTM2MEREMTFFNUE0NEU5NzBFQkM5MzRDMjEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0NDkwMTI3LTdlNzAtMjI0OC05YjU5LWZmNDI4ZGNkNWIwZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpjMWE2MTM5Ny01ZDA0LTQ4NGItYWM2Yy1kOTA0YmM2OGY4NGUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Yx++pAAADAFBMVEXr0t37VYbubI7siaTpmrH1kanjYYbl3ufxhaD2jKXmao3qtMXr2+T4q73YZof8pbfW1dX9rb31lqz+vcriWIDjucncS3bEv8H5qbvqxNLxc5LZKlf3mK3dTnjhSnfo6/DwgZ3neZnpdZXbOWTmcZPogZ7q4urlZorn///qprryfJnm4+rm///rU3vjZYnl8fbVU3r2pbjpqLzqhqLo8fXgVX7dTHfog6D9qrvzk6r6n7L5r7/pcZL8p7jqYYb5p7msiZTxjKa1o6jigZ3q6O72qrznbpDaepb5nLHzobbu///kw9H1k6rtgZ7uuMjiXoTofp38qLnuepj+qrrsdpb6scHhscLZXoHulq77orXpepno9vntfZvxaovxlq7ca4rlztrp+Pr6pLfxhJ/+yNP0nLHp+vz9o7XziqTfVHzklK3xiKLsjaf8ucf1mrDeUnv/t8X1iKL6obT/3OLzjqfpeJfqyNXrsMLxssPq///hXIPqW4HqoLbyeJbvhaD4mq/3lavdma7pucm6WnfmXYLZSnX4mK3kobfiUXn4ma7k///+sL/tZ4npla3ovMz///8AAADm+/3GVXfkTHbbHlHmVn7rSnPtcJD/XJDqcpPcUHnm9Pfm6e7nq7/bWHz6n7P2hZ/ZTXXgRm/jR3H9qbn5oLT/zNbvqr7lUnv8obTvnLLvf5zjY4jaTXP5n7Pmd5f9s8L/8vXkYof/7/PthKD6nbH5m7D/1t7eUXrk2eHiWoHqkKnhWH/hUnz7tsX+qLj8n7Lj///n+fv2gJz8tcPwqLvzn7Tpk6zYQ2veUHn+q7v+qbr7o7XfU3ztk6zrzNj7q7zmytb/6+7x8fH//f3s+/62d4rfb5DfKlnkOWf/+/zdSXT1j6fnfJvpWH7opLn3nbL/+frZUHbowM/p1+HsvMznjKbrdJTYVHr+xM/rRnDoTHrrt8f4obb5orb/ydP2n7T4iqPxlKzjVXvohKHq/P34rL76tMP/xtHk/P/n/f7WTnf/9/nhV3/tj6n0nbMnNJpZAAAIIUlEQVR42uybDVgT5x3AAyEhBDQFKkOEGj7OHBKoGAgNn42FIGkgmIIyiBTIBGwIFkrRi0aRKhONZtRaoKBgC4IklTVVKim1rV8TxJVtbusGqBt0cR3bOmd1c4M20fARzCV3wK3r89zvecJz73vv5f3dc7yX//3f9wg/sYnKnKm6WS0stLXUwhoEXOb7I6OCAVbGgq75lqXDbXaFy+Ay85Cx0APCsQJ3JJwM3LngMrgM9jLmPVjqD24M4TK4zHcmYyE+gY1WrMYzuAwug5EMmngG7o5v9TuwCq5wme9CxvZDHNy/IeqdC/FEicvgMlMyKhQgTFYgG2UWwGVwmfnKoHgUg02XIU87zDoIl8Fl5iYD16lqQbH5A4PLLKTM+6+c+LstPvjl9f+FzH8/kB1w7bPFgZdPvDdHGYSpXiN/+Fcf7eMXYBRe+Piqaesq7ar7e3DxDNxQQy1zgkbr63vGIobqn7q2mLb7Yk66/x5jmfdbClpgKTjw54u0qRKt4BWMZX70ScwUNFqMGbQWd/eB6bp1n7yMscyBk7Qpnmk5WTBdohUUXHR3nbGbRlu3oDKPHxX3w34TpTSZzLU/cqrcH+nqfr9putjfnxeD4rcCNiC3JlM6SWvpgMz94rrIM62PymfyZLK8M6UzicNYJq8p0kRTZFfpwDlZet7arlNNkU1nItNlMV1Tex+Sh7HM39bOoLqqdeDcuYFTVdVru6o8ZQNVXWvNKJ27jO3pAUNN6y4j3lWP8K6ouOWZnh7XVVXRej+quqJqEu/qLkOzU7ZuWirYOzAimVveRvI8p4jzjIq6H+XpGZW+KG5GbbWx2S2MZYorKioEbouiFk1j7HzRvbg4z+mqe1G7SIaGxVjLCASC5mbPUBJpaAYkpwslgunS0Ff3vEmGht4Yy7iRSE6cckJVIcntIQKSwPhXcGm0zcnNxFBz8T23MhKJ5IZWxmq64PH4wq3swqXzTBcnyqaER4SGJiTEhbow92/7q6km4SuKdwKnsKysjGMtAWehT7QypMILRU8zCU6S4tA7JA6neWvDZyUcAT0HDLtcwnnI0CaX5Zd2DUkLCwtJGMuUUSiibpBQqC4OldIlEgXx0xUr6ZSNq8GwDC+JEbqkpHv/tgquRCqVlmEsw5VIRAQmoUTsliTdqVYo9I1hEi+vjYFgQ7aCLqFQpArFyrFPU/6h8DIUuBjLFNIl9iNMQrOIc5miyHZOIY5mcTvGuBM1WW0krlpNX5k0ss1hf0qS8yWJmi5FK4Py6UyqpitXM0fpCs43ktqMxty28nxiOTimDALbypKyKSJl5dOEO/9OSalZsVOhpsBNFMCcO1qZnWLxxh1MF7p+YpNalPx8d0clM3lrfkpwDthhz0m6zFXezLnZUbO0LczldJr4NMYyySKR0oG5Ymctt1gkzqYu3hMI/nzfH6n2I2BgbFrynaRveBs6M8Li/Y4fSxOLkjGWUaelKVk1Yert9GyR3n5HQ0cmWPSnJXeDD4GBwUp7vZTrN/p1ESGeuGR9mj5NjLGMWK+vjQ6CHOqJ0tjtwTfBSj+QVQl98aYz01l/2n77jdjo5RBxJD4DgsRKvQitDMIU8GRRFF0fHZsDLYdyCZVFwQFMAgAedAC/2HgTbMyCXJYG1n/5C/DDsTBiUFamsj7TpsysLARKmTQer/bGCJib4whB4GcBjsuB86t/Bo7ZH2zID3oehMAwwIHpcDSf6JiVGRvth7GMnsqj3jgE8ncve7E7Fyo/9HVnUPlBZqXXh40P4t/1/3E+mPsSc/UOsGj0fGcsrx5jmXoqldruDIKHvnzOkQ8Kj0IB8fwi5tbtrKBcKPPz9RB/iRwaceB3lD94dQ81GmOZaAaDcfgoVEMo5/O7N7zxUsOwJrETGvkdwxHKWvprPrjbv72RIEzkreD7HmHw5iSDcPrVAE+r0byzA4KghvWJy/xrt/jL/T8XJv72yJFGftaD7t233zjCuHJs3zLec4kMrYZqbehYeohDKUMla8la+eINx6/4D/oRAT+GL4v46ttaVuaLG469e8V/DxEYjq4nJ2e8vWwPg4y1DEMoFGr2HX7KXzsxEQEAp1kAAEQUsQDWP9/RMcQTREOR5RfOY1G1hoYMjGVCdHJ5j3YiM/zJWWgZZKHu0WZ4L5WlGZfL5SEYy2h0Ot24MLUzhKHRhIQYP2YYyxqGJiBCG25oqJ2TjNWZCLOd5PGenvAe34i7d4FhAEhNjTDHUJGaCtyNSBVe6+npIducApmnzObw8PDNQg1ZzgNCdL6+5JkIQ1IDxqkAVa4RhhsRYiwj3LLZQC/bZ1CXGhACUAfZPtOwfQKGNZ3DHw36+FwzNsNaRv7RFhNs4TBA9endMhP2tQCgU8c2ld7SLajM4wcstnur14THtXE2+2zvTM6yfXrOekyW2uUoViTMCiEQyaypm74qHmbXyHSlBj0mN4/X/QZjGdXrdXvZiNhr196NtcwT7XWDez1ss9eubo0KaxnVD16vs/vLUzY4bFf3nzWqhZOBjY1/9exrq26vssrtVa89+wRsJgM2yJ6DDCKuX1f9/8hYy/HgMvORQTj9ajtURoH1hzhcBpexKTPPMQEXQqN+YwHNYh5cBpeBuwMjSkUgXa5rddm2hYNwGVxmbjIoOoAN2VGcAVwMhct832SsvquCbJmrpdddkSUgcBlcBnsZq/dRCzK2Ta0vP8BlcJmFkrEaJcClLqzutKCLy+Ay85CxHc/YTlbYHmoIF/PgMrgMChk0gQfC2QlkOTbYmThcBpdB9N3fCjAAK/6Cw0xrGoYAAAAASUVORK5CYII=)
      no-repeat;
    background-size: cover;
  }
  .bili-mini-scan-refresh[data-v-4bb99a48-qr] {
    width: 173px;
    height: 173px;
    background: hsla(0, 0%, 100%, 0.9);
    color: #00a1d6;
    text-align: center;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
  }
  .bili-mini-scan-refresh > div[data-v-4bb99a48-qr] {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIcSURBVHgBrVbdcdNAEP7urEHM8OISLryRCYPVgdIB7zw4qiCkAkIFCRXIpoJQgU0F9kCG8JajAvSIwdKxt3uRnDhyFDvfjDTaW+3P7a2+lUJX5DMDREaEpUWW2C5marPT7yl6vWM4pCT172gLKHeBUn1Btn/xuAD55YAcn8G5FN1gUS0O6135xKAMsoPReoDx1RBw5ysZk7EbA+VcLg9fKp1CK3oXpratcAIsRtDxb5Gr5HaA8c9jWj0PUkEvnPgssAn55RG0/tAEUqeU4KkEKA+bAP4QdXzdZK1oy68suiC/Ils3wepuQgBdCzqebOWcsTRSxnVEksG3t3X0qvpIZbHoCt8QWk/a1LKDXjQMsn2w5mv4Z9luHWNkr6eyA+lztG1zI7KkoPtem1rzAdUtWU3xFMhnfb7AZ0AHhJ4onr24xq7wjnU8g086n+1FeHI8p8ydkedoQIcc2Vr390+CneErEkAV0aHfC17QboCdodPwUODdy1/SpgpTWVND7AodfFTuK4sslOWnoDbMLdtCbI0IasT3Wvn5xyR8D0Ryi6TrQGmcM5fd8JHFcJ+/jYaLSmJOOYs+v8gTbCvnYC4LaAJkB3OmZ4EYdCkX0zX3vRHnNBNWiFLdY/CeyOtsZSUMHP+VL4NhPECk3tD6ERqKvnd+tIzMFn5vg6MudOx8flf1wNAnGlfEtKpl6LNj6kBizTYXmwPcCrbdb8t/fnXRAHH4XCkAAAAASUVORK5CYII=)
      50% no-repeat #fff;
    border-radius: 50%;
    cursor: pointer;
    margin: 36px auto 0;
    width: 56px;
    height: 56px;
    margin-bottom: 10px;
  }
  .bili-mini-scan-refresh > p[data-v-4bb99a48-qr] {
    font-size: 13px;
    color: #505050;
  }
  .bili-mini-scan-success[data-v-4bb99a48-qr] {
    width: 173px;
    height: 173px;
    background: hsla(0, 0%, 100%, 0.9);
  }
  .bili-mini-scan-success > div[data-v-4bb99a48-qr] {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAASCAYAAABFGc6jAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADcSURBVHgBtdLBDYIwFAbgvxijR0bg6sFEN5AJZAPDBmyATFKdRDfQxAjXjuCVg1QKJkIo2L7An7ykr23ypXkFpgx/7MDTQC0Zpso5OwDyVDcycTBFWogKc8d/UQeBQMH8caEeBOFKMPCbi9kirrbfeYJw+wIlA4hqyhnNA0hEVTmLSwWPjHwhKRoXNtaYAVJD4fqKQiYkzBBR+X0G/jzCYXHj7I4i93tnZoG0IRvMEulCJhgB0UNDmLPcU5B+SI+JsjwKMgzpMRLyH9Jj1ogZ1MZIiF14GoFnHoj5AHTxnCpWFWS6AAAAAElFTkSuQmCC)
      50% no-repeat #fff;
    border-radius: 50%;
    cursor: pointer;
    margin: 36px auto 0;
    width: 56px;
    height: 56px;
  }
  .bili-mini-scan-success > p[data-v-4bb99a48-qr] {
    text-align: center;
    font-size: 13px;
    color: #505050;
    margin-top: 10px;
  }
  .bili-mini-scan-success .line2[data-v-4bb99a48-qr] {
    margin-top: 0;
  }
  .bili-mini-scan-title[data-v-4bb99a48-qr] {
    font-size: 18px;
    line-height: 1;
    text-align: center;
    color: #212121;
    position: relative;
    top: -44px;
    width: 100%;
  }
  .bili-mini-scan-title + .bili-mini-scan-text[data-v-4bb99a48-qr] {
    margin-top: 8px;
  }
  .bili-mini-scan-text[data-v-4bb99a48-qr] {
    font-size: 14px;
    line-height: 1;
    text-align: center;
    color: #212121;
  }
  .bili-mini-scan-text + .bili-mini-scan-text[data-v-4bb99a48-qr] {
    margin-top: 4px;
  }
  .bili-mini-scan-text a[data-v-4bb99a48-qr] {
    color: #00a1d6;
    font-size: 14px;
  }
  .qrcode-loading[data-v-30f9899b-qr] {
    background-image: url(https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/loadTV.99606e2e.gif);
    background-color: #f7f7f7;
    background-position: 50%;
    background-repeat: no-repeat;
  }
  .qrcode-loading > div[data-v-30f9899b-qr] {
    display: none;
  }
</style>
<div data-v-720b4453-qr="" class="bili-mini-mask">
  <div data-v-720b4453-qr="" class="bili-mini">
    <div data-v-720b4453-qr="" class="bili-mini-close"></div>
    <div data-v-720b4453-qr="" class="bili-mini-content">
      <div data-v-4bb99a48-qr="" data-v-720b4453-qr="" class="bili-mini-scan">
        <div data-v-4bb99a48-qr="" class="bili-mini-scan-top">
          <div data-v-4bb99a48-qr="" class="bili-mini-scan-qrcode">
            <div data-v-4bb99a48-qr="" class="bili-mini-scan-qrcode-box">
              <div data-v-4bb99a48-qr="">
                <div data-v-4bb99a48-qr="" class="bili-mini-scan-main">
                  <p data-v-4bb99a48-qr="" class="bili-mini-scan-title">扫描二维码登录</p>
                  <div data-v-4bb99a48-qr="">
                    <div data-v-4bb99a48-qr="" class="bili-mini-scan-code">
                      <div data-v-30f9899b-qr="" data-v-4bb99a48-qr="" class="" style="width: 160px; height: 160px">
                        <div data-v-30f9899b-qr="" class="qrcode"></div>
                      </div>
                    </div>
                    <img
                      data-v-4bb99a48-qr=""
                      src="https://s1.hdslb.com/bfs/seed/jinkela/short/mini-login/img/qr-tips.51ff2bcf.png"
                      alt=""
                      class="bili-mini-scan-tips"
                      style="display: none"
                    />
                  </div>
                </div>
                <div data-v-4bb99a48-qr="" class="bili-mini-scan-refresh" style="display: none">
                  <div data-v-4bb99a48-qr=""></div>
                  <p data-v-4bb99a48-qr="">二维码已过期</p>
                  <p data-v-4bb99a48-qr="">请点击刷新</p>
                </div>
                <div data-v-4bb99a48-qr="" class="bili-mini-scan-success" style="display: none">
                  <div data-v-4bb99a48-qr=""></div>
                  <p data-v-4bb99a48-qr="">扫码成功</p>
                  <p data-v-4bb99a48-qr="" class="line2">请在手机登录</p>
                </div>
              </div>
              <div data-v-4bb99a48-qr="" class="bili-mini-scan-download" style="display: none">
                <p data-v-4bb99a48-qr="" class="bili-mini-scan-title">扫码下载客户端</p>
              </div>
            </div>
          </div>
          <div data-v-4bb99a48-qr="" class="bili-mini-scan-description">
            <p data-v-4bb99a48-qr="" class="bili-mini-scan-text">
              请使用<a data-v-4bb99a48-qr="" href="https://app.bilibili.com/" target="_blank">哔哩哔哩客户端</a>
            </p>
            <p data-v-4bb99a48-qr="" class="bili-mini-scan-text">扫码登录或扫码下载APP</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`

// ajax
const HTTP = {
  get(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.onload = () => {
        if (xhr.status == 200) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
      xhr.send()
    })
  }
}

// 定时请求
const RAF = {
  intervalTimer: null,
  timeoutTimer: null,
  setTimeout(cb, interval) {
    // 实现setTimeout功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.timeoutTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        cb()
        cancelAnimationFrame(this.timeoutTimer)
      }
    }
    this.timeoutTimer = requestAnimationFrame(loop)
    return this.timeoutTimer
  },
  clearTimeout() {
    cancelAnimationFrame(this.timeoutTimer)
  },
  setInterval(cb, interval) {
    // 实现setInterval功能
    let now = Date.now
    let stime = now()
    let etime = stime
    let loop = () => {
      this.intervalTimer = requestAnimationFrame(loop)
      etime = now()
      if (etime - stime >= interval) {
        stime = now()
        etime = stime
        cb()
      }
    }
    this.intervalTimer = requestAnimationFrame(loop)
    return this.intervalTimer
  },
  clearInterval() {
    cancelAnimationFrame(this.intervalTimer)
  }
}

const ACCESS = {
  qrRequestUrl: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/auth_code',
  qrResultUrl: 'https://passport.bilibili.com/x/passport-tv-login/qrcode/poll',
  appkey: '4409e2ce8ffd12b8',
  appsec: '59b43e04ad6965f34319062b478f83dd',
  auth_code: '',
  access_token: '',
  qrResultTimer: '',
  paramsToFormData(obj) {
    const formData = new FormData()
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Array) {
        obj[key].forEach(item => {
          formData.append(key, item)
        })
        return
      }
      formData.append(key, obj[key])
    })
    return formData
  },
  // 获取扫码登录链接
  loginQR() {
    let postData = {
      local_id: 0,
      ts: 0
    }
    postData = ACCESS.appsign(postData, ACCESS.appkey, ACCESS.appsec)
    postData = new URLSearchParams(postData).toString()
    GM_xmlhttpRequest({
      method: 'POST',
      url: ACCESS.qrRequestUrl,
      data: postData,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 BiliDroid/5.15.0 (bbcallen@gmail.com)',
        'Content-type': 'application/x-www-form-urlencoded',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache'
      },
      onload: function (res) {
        ACCESS.loginQRBack(res)
      },
      onerror: function (e) {
        console.error(e)
      }
    })
  },

  // 获取登录返回
  loginQRBack(res) {
    if (!ACCESS.isJSON(res.responseText)) {
      return false
    }
    let resData = JSON.parse(res.responseText)
    if (resData.code !== 0 || typeof resData.data.url === 'undefined' || typeof resData.data.auth_code === 'undefined') {
      return false
    }
    console.log(resData.data.url)
    ACCESS.auth_code = resData.data.auth_code
    // 生成二维码
    new QRCode(UI.loginQRNode.querySelector('.qrcode'), {
      text: resData.data.url,
      width: 160,
      height: 160,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    })
    // 定时获取扫码结果
    ACCESS.qrResultTimer = RAF.setInterval(ACCESS.qrResult, 1000)
  },

  // 获取扫结果
  qrResult() {
    if (ACCESS.auth_code === '') {
      return false
    }
    let postData = {
      auth_code: ACCESS.auth_code,
      local_id: 0,
      ts: 0
    }
    postData = ACCESS.appsign(postData, ACCESS.appkey, ACCESS.appsec)
    postData = new URLSearchParams(postData).toString()
    GM_xmlhttpRequest({
      method: 'POST',
      url: ACCESS.qrResultUrl,
      data: postData,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 BiliDroid/5.15.0 (bbcallen@gmail.com)',
        'Content-type': 'application/x-www-form-urlencoded',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache'
      },
      onload: function (res) {
        ACCESS.qrResultBack(res)
      },
      onerror: function (e) {
        console.error(e)
      }
    })
  },

  // 获取扫码结果回调
  async qrResultBack(res) {
    if (!ACCESS.isJSON(res.responseText)) {
      console.log('qrResultBack: is no json')
      console.log(res.responseText)
      return false
    }
    let resData = JSON.parse(res.responseText)
    if (resData.code !== 0 || typeof resData.data.access_token === 'undefined') {
      console.log(resData)
      return false
    }
    console.log(resData)
    ACCESS.access_token = resData.data.access_token
    // 储存 KEY
    await SETTINGS.set('access_key', resData.data.access_token)
    RAF.clearInterval(ACCESS.qrResultTimer)
    UI.lgoinReimd.hide()
    UI.loginQRNode.remove()
  },

  // 为请求参数进行 api 签名
  appsign(params, appkey, appsec) {
    params.appkey = appkey
    let newParams = {}
    Object.keys(params)
      .sort()
      .map(key => {
        newParams[key] = params[key]
      })
    query = new URLSearchParams(newParams).toString()
    sign = md5(query + appsec)
    params.sign = sign
    return params
  },
  // 判断字符串是否为JSON
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str)

        if (typeof obj == 'object' && obj) {
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log('error：' + str + '!!!' + e)

        return false
      }
    }
    return false
  }
}

// 脚本设置
const SETTINGS = {
  // 默认设置
  autoPlay: 1, // 自动播放
  widescreen: 1, // 自动宽屏
  access_key: null,
  async set(key, value) {
    console.log(`SETTINGS.set ${key} ${value}`)
    return await GM.setValue(key, value)
  },
  async get(key) {
    return await GM.getValue(key, SETTINGS[key])
  },
  async load() {
    SETTINGS.autoPlay = await SETTINGS.get('autoPlay')
    SETTINGS.widescreen = await SETTINGS.get('widescreen')
  }
}

// 获取推荐
const RECOMMAND = {
  tagPass: 0, // 推荐标签，用来判断token有效性
  loginPass: 0, // 无推荐标签次数，判断是否token失效
  loginCheckNun: 5, // 连续5次无标签判断为失效
  oldVideoData: [], // 旧视频数据
  // 处理视频数据
  handleVideo(video) {
    let results = {}
    switch (video.goto) {
      case 'av':
        // 普通视频
        results.bvurl = `https://www.bilibili.com/video/av${video.param}`
        results.view = video.play
        results.like = video.like
        break
      case 'bangumi':
        // 影视
        results.bvurl = `https://www.bilibili.com/bangumi/play/ep${video.param}`
        results.view = video.play
        results.like = video.favorite
        results.username = video.badge
        break
      case 'live':
        // 直播
        results.bvurl = `https://live.bilibili.com/${video.param}`
        results.view = video.online ? video.online : 0
        results.like = video.fans
        break
      case 'up':
        results.bvurl = `https://www.bilibili.com/video/user/${video.param}`
        break
      case 'ad_av':
        // 阿B的广告视频
        return false
      default:
        results.bvurl = video.uri
        results.view = video.play
        results.like = video.like
        break
    }
    results.bvurl = results.bvurl + '?recommand=1'
    results.cover = video.cover
    results.duration = video.duration
    results.title = video.title
    results.uid = video.mid
    results.avatar = video.face
    if (typeof results.username === 'undefined') {
      results.username = video.name
    }
    // 如果有推荐TAG，则使用推荐TAG
    if (typeof video.rcmd_reason !== 'undefined') {
      RECOMMAND.tagPass++
      results.username = `<span class="bili-video-card__info--icon-text" style="overflow: unset !important;">${video.rcmd_reason.content}</span> ${results.username}`
    } else {
      results.username = `<svg class="bili-video-card__info--owner__up"><use xlink:href="#widget-up"></use></svg> ${results.username}`
    }

    return results
  },
  // 获取随机视频
  async recommand() {
    RECOMMAND.tagPass = 0
    const access_key = await SETTINGS.get('access_key')
    // 计算首页推荐参数Sign
    let recommendParams = {
      access_key: access_key,
      build: 501000,
      mobi_app: 'android',
      network: 'wifi',
      platform: 'android',
      pull: 'true',
      style: 2,
      ts: 0
    }
    recommendParams = ACCESS.appsign(recommendParams, ACCESS.appkey, ACCESS.appsec)
    recommendParams = new URLSearchParams(recommendParams).toString()
    const url = `https://app.bilibili.com/x/feed/index?${recommendParams}`
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 BiliDroid/5.15.0 (bbcallen@gmail.com)',
        'Content-type': 'application/x-www-form-urlencoded',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache'
      },
      onload: async function (res) {
        let data = JSON.parse(res.responseText)
        let videos = []
        if (!data || data.code !== 0) {
          UI.updateRecommands(0)
          console.log(res)
          return
        }
        console.log(data)
        data.data.forEach(element => {
          videos.push(RECOMMAND.handleVideo(element)) // 处理视频数据
        })
        RECOMMAND.oldVideoData[0] = RECOMMAND.oldVideoData[1]
        RECOMMAND.oldVideoData[1] = videos
        // 添加视频到页面
        await UI.updateRecommands(videos)
        // 无推荐TAG可能token失效
        if (RECOMMAND.tagPass === 0) {
          RECOMMAND.loginPass++
        } else {
          RECOMMAND.loginPass = 0
        }
        // 无TAG达到检测次数，提示登录
        if (RECOMMAND.loginPass > RECOMMAND.loginCheckNun) {
          UI.lgoinReimd.show()
        } else {
          UI.lgoinReimd.hide()
        }
      },
      onerror: function (e) {
        UI.updateRecommands(0)
        console.error(e)
      }
    })
  }
}

// 与页面交互的逻辑
const UI = {
  node: null,
  loginQRNode: null,

  // 登录提醒
  lgoinReimd: {
    show() {
      UI.node.querySelector('.login_qr_btn_remind').style.display = 'block'
    },
    hide() {
      UI.node.querySelector('.login_qr_btn_remind').style.display = 'none'
    }
  },
  // 上一批 按钮控制
  pageButton: {
    currentPage: 1, // 当前页数
    prve() {
      UI.node.querySelector('.primary-btn.page-btn span').innerText = '上一批'
      UI.node.querySelector('.primary-btn.page-btn').classList.remove('disable-button')
      this.currentPage = 1
    },
    next() {
      UI.node.querySelector('.primary-btn.page-btn span').innerText = '下一批'
      this.currentPage = 0
    }
  },
  // 自动播放 切换按钮
  autoPlayButton: {
    // 加载按钮设置
    async load() {
      console.log(`load().autoPlay ${await SETTINGS.get('autoPlay')}`)
      if ((await SETTINGS.get('autoPlay')) === 0) {
        UI.node.querySelector('.autoplay-button .switch-button').classList.remove('on')
      }
    },
    // 切换
    switch(switch_status = 0) {
      let nodeClassList = UI.node.querySelector('.autoplay-button .switch-button').classList
      if (Array.from(nodeClassList).indexOf('on') === -1) {
        switch_status = 1
      }
      SETTINGS.set('autoPlay', switch_status)
      if (switch_status) {
        UI.node.querySelector('.autoplay-button .switch-button').classList.add('on')
      } else {
        UI.node.querySelector('.autoplay-button .switch-button').classList.remove('on')
      }
    }
  },
  // 视频宽屏 切换按钮
  widescreenButton: {
    // 加载按钮设置
    async load() {
      console.log(`load().widescreen ${await SETTINGS.get('widescreen')}`)
      if ((await SETTINGS.get('widescreen')) === 0) {
        UI.node.querySelector('.widescreen-button .switch-button').classList.remove('on')
      }
    },
    // 切换
    switch(switch_status = 0) {
      let nodeClassList = UI.node.querySelector('.widescreen-button .switch-button').classList
      if (Array.from(nodeClassList).indexOf('on') === -1) {
        switch_status = 1
      }
      SETTINGS.set('widescreen', switch_status)
      if (switch_status) {
        UI.node.querySelector('.widescreen-button .switch-button').classList.add('on')
      } else {
        UI.node.querySelector('.widescreen-button .switch-button').classList.remove('on')
      }
    }
  },
  // 视频UI 播放按钮
  videoUIPlay: {
    node: '.bpx-player-control-bottom .bpx-player-ctrl-btn.bpx-player-ctrl-play',
    click() {
      document.querySelector(UI.videoUIPlay.node).click()
      document.body.removeEventListener('mouseover', UI.videoUIPlay.click)
    }
  },
  // 视频UI 宽屏按钮
  videoUIWidescreen: {
    node: '.bpx-player-control-bottom .bpx-player-ctrl-btn-icon.bpx-player-ctrl-wide-enter',
    click() {
      document.querySelector(UI.videoUIWidescreen.node).click()
      document.body.removeEventListener('mouseover', UI.videoUIWidescreen.click)
      scrollTo(0, 0) // 展开宽屏模式会看不见标题，回顶部
    }
  },
  // 是否首页
  isIndex() {
    let path = window.location.pathname
    if (path == '/' || path == '/index.html') {
      return true
    } else {
      return false
    }
  },
  // 是否视频播放页
  isVideo() {
    let path = window.location.pathname
    if (path.indexOf('video/') > -1) {
      return true
    } else {
      return false
    }
  },
  // 来自猜你喜欢
  isRecommand() {
    let url = new URL(window.location.href)
    if (url.searchParams.get('recommand') === '1') {
      return true
    }
    return false
  },
  // 获取BVID
  getBVID() {
    let url = window.location.href,
      m = /\/BV(\w+)/.exec(url)
    if (m) {
      return m[1]
    } else {
      console.error(`${LOG_PREFIX} 找不到BV号：${url}`)
    }
    return null
  },

  // 插入推荐模块
  insertRecommands() {
    return new Promise((resolve, reject) => {
      // 复制「动画」模块来做一个「猜你喜欢」
      // 20191125 b站改版，几个首页模块变成后渲染了，需要异步获取

      // 2022改版后几个模块彻底公共化了，连个标识id都没有了。那我们也别从页面里clone了，干脆自己用字符串创建元素吧
      const node = document.createElement('div')
      node.id = '_bili_guessyoulike'
      node.innerHTML = moduleTemplate
      node.style.marginBottom = '50px'

      // 给「换一换」按钮绑定事件
      const changeBtn = node.querySelector('.primary-btn.roll-btn')
      // 点这个按钮就通知插件换一批推荐视频
      changeBtn.addEventListener('click', () => {
        window.postMessage(
          {
            type: 'UPDATE_RECOMMANDS'
          },
          '*'
        )
      })
      // 显示上一批视频
      const prevBtn = node.querySelector('.primary-btn.page-btn')
      prevBtn.addEventListener('click', () => {
        window.postMessage(
          {
            type: 'SWITCH_PAGE'
          },
          '*'
        )
      })
      // 扫码登录 按钮
      const loginQRBtn = node.querySelector('.primary-btn.login-qr-btn')
      loginQRBtn.addEventListener('click', () => {
        window.postMessage(
          {
            type: 'LOGIN_QR_SHOW'
          },
          '*'
        )
      })
      // 自动播放设置 按钮
      const autoPlayBtn = node.querySelector('.autoplay-button .switch-button')
      autoPlayBtn.addEventListener('click', () => {
        window.postMessage(
          {
            type: 'SWITCH_AUTOPLAY'
          },
          '*'
        )
      })
      // 视频宽屏设置 按钮
      const widescreenBtn = node.querySelector('.widescreen-button .switch-button')
      widescreenBtn.addEventListener('click', () => {
        window.postMessage(
          {
            type: 'SWITCH_WIDESCREEN'
          },
          '*'
        )
      })

      // 插入页面
      // 目前看来第一个<section class="bili-grid short-margin grid-anchor">是首屏的推荐模块，我们直接插在她下面就可以了
      const anchor = document.querySelector('.bili-grid.short-margin.grid-anchor')
      if (!anchor) {
        console.error(`${LOG_PREFIX} 找不到首屏推荐模块`)
        throw new Error(`${LOG_PREFIX} 无法定位首屏推荐模块 <section class="bili-grid short-margin grid-anchor">`)
      }
      anchor.insertAdjacentElement('afterEnd', node)
      UI.node = node
      UI.autoPlayButton.load()
      UI.widescreenButton.load()

      resolve()
    })
  },
  // 插入QR登录窗口
  insertLoginQR() {
    return new Promise((resolve, reject) => {
      UI.loginQRNode = document.querySelector('#_login_qr')
      if (UI.loginQRNode) {
        return UI.loginQRNode
      }
      const loginQRNode = document.createElement('div')
      loginQRNode.id = '_login_qr'
      loginQRNode.innerHTML = loginQRTemplate

      // 扫码登录按钮事件
      const loginQRCloseBtn = loginQRNode.querySelector('.bili-mini-close')
      loginQRCloseBtn.addEventListener('click', () => {
        window.postMessage(
          {
            type: 'LOGIN_QR_CLOSE'
          },
          '*'
        )
      })
      document.body.appendChild(loginQRNode)
      UI.loginQRNode = loginQRNode

      // 二维码悬停事件
      // const qrImgBox = loginQRNode.querySelector('.bili-mini-scan-code')
      // qrImgBox.addEventListener('mouseenter', () => {
      //   // 显示实例图片
      //   loginQRNode.querySelector('.bili-mini-scan-tips').style.display = 'block'
      // })
      // qrImgBox.addEventListener('mouseleave', () => {
      //   // 隐藏实例图片
      //   loginQRNode.querySelector('.bili-mini-scan-tips').style.display = 'none'
      // })

      resolve()
    })
  },
  // 获取推荐模块的引用
  getRecommandNode() {
    return new Promise(async resolve => {
      // 检查是否有已插入的节点
      UI.node = document.querySelector('#_bili_guessyoulike')
      if (!UI.node) {
        // 没有就创建
        await UI.insertRecommands()
      }
      resolve()
    })
  },
  renderVideoCard(video) {
    function toWan(number) {
      return number > 9999 ? (number / 10000).toFixed(1) + '万' : number
    }

    function toMin(seconds) {
      return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0')
    }

    function toHttps(url) {
      return url.replace('http://', 'https://')
    }
    if (!video) {
      // 没有数据，占位
      video = {
        bvurl: 'https://www.bilibili.com/video/BV1GJ411x7h7',
        duration: 213,
        title: '【官方 MV】Never Gonna Give You Up - Rick Astley',
        cover: 'https://i1.hdslb.com/bfs/archive/5242750857121e05146d5d5b13a47a2a6dd36e98.jpg',
        view: 57993095,
        like: 1610207,
        uid: 486906719,
        avatar: 'https://i2.hdslb.com/bfs/face/459425ffc7f0c9c12976fb678c34734462be8ab7.jpg',
        username: '阿B的广告'
      }
    }
    return videoCardTemplate
      .replaceAll('!#{bvurl}', video.bvurl)
      .replaceAll('!#{duration}', toMin(video.duration))
      .replaceAll('!#{title}', video.title)
      .replaceAll('!#{cover}', toHttps(video.cover))
      .replaceAll('!#{view}', toWan(video.view))
      .replaceAll('!#{like}', toWan(video.like))
      .replaceAll('!#{uid}', video.uid)
      .replaceAll('!#{avatar}', toHttps(video.avatar))
      .replaceAll('!#{username}', video.username)
  },
  async updateRecommands(videos) {
    await UI.getRecommandNode()
    const node = UI.node
    const stage = node.querySelector('.bangumi-activity-body')
    if (videos.length) {
      // 生成视频卡片
      const videoCardsHTML = videos.map(video => UI.renderVideoCard(video)).join('')
      stage.innerHTML = videoCardsHTML
    } else {
      stage.innerHTML = '<p style="color: #777; line-height: 360px; text-align: center; width: 100%;">获取数据错误</p>'
    }
  },
  // 监听来自页面的更新请求
  async listen() {
    window.addEventListener('message', async ev => {
      switch (ev.data.type) {
        // 更新视频
        case 'UPDATE_RECOMMANDS':
          // 图标动画
          const rotateNode = document.querySelector('#_bili_guessyoulike .roll-btn svg')
          let rotateAngle = parseInt(rotateNode.style.transform.replace(/rotate\((\d+)deg\)/, '$1')) + 360
          rotateNode.style.transform = `rotate(${rotateAngle}deg)`
          // 获取视频
          RECOMMAND.recommand()
          // 上一批 按钮解锁
          UI.pageButton.prve()
          break
        // 显示登录窗口
        case 'LOGIN_QR_SHOW':
          await UI.insertLoginQR()
          ACCESS.loginQR()
          break
        // 关闭登录窗口
        case 'LOGIN_QR_CLOSE':
          RAF.clearInterval(ACCESS.qrResultTimer)
          UI.loginQRNode.remove()
          break
        // 切换页数
        case 'SWITCH_PAGE':
          if (UI.pageButton.currentPage === 1) {
            await UI.updateRecommands(RECOMMAND.oldVideoData[0])
            UI.pageButton.next()
          } else {
            console.log(RECOMMAND.oldVideoData[1])
            await UI.updateRecommands(RECOMMAND.oldVideoData[1])
            UI.pageButton.prve()
          }
          break
        case 'SWITCH_AUTOPLAY':
          UI.autoPlayButton.switch()
          break
        case 'SWITCH_WIDESCREEN':
          UI.widescreenButton.switch()
          break
      }
      // if (ev.data.type && ev.data.type == 'UPDATE_RECOMMANDS') {
      //   // 图标动画
      //   const rotateNode = document.querySelector('#_bili_guessyoulike .roll-btn svg')
      //   let rotateAngle = parseInt(rotateNode.style.transform.replace(/rotate\((\d+)deg\)/, '$1')) + 360
      //   rotateNode.style.transform = `rotate(${rotateAngle}deg)`
      //   ACCESS.loginQR()
      //   console.log(GM.getValue('access_key'))
      //   console.log(GM.getValue('recommendSign'))
      //   // 获取视频
      //   RECOMMAND.recommand()
      // }
    })
  }
}

// 等待元素
function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector))
    }

    const observer = new MutationObserver(mutations => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector))
        observer.disconnect()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

;(async function () {
  'use strict'
  GM_addStyle(`
    @media (min-width: 1300px) {
      #_bili_guessyoulike .bangumi-activity-area .bangumi-activity-body {
        grid-column: span 5 !important;
        grid-template-columns: repeat(5,1fr) !important;
      }
    }
    #_bili_guessyoulike .login-qr-btn,#_bili_guessyoulike .page-btn {
      height: auto;
      padding: 8px 12px;
      line-height: 16px;
      font-size: 13px;
    }
    #_bili_guessyoulike .login_qr_btn_remind {
      width: 12px;
      height: 12px;
      border-radius: 20px;
      background-color: var(--Re5);
      position: relative;
      left: -9px;
      top: -12px;
    }
    #_bili_guessyoulike .disable-button{
      opacity:0.5;
      pointer-events:none;
    }
    #_bili_guessyoulike .page-btn svg {
      width: 13px;
      height: 13px;
    }
    .autoplay-button .switch-button:after,
    .widescreen-button .switch-button:after {
      content: "";
      position: absolute;
      top: 1px;
      left: 1px;
      border-radius: 100%;
      width: 16px;
      height: 16px;
      background-color: #fff;
      transition: all .2s;
    }
    .autoplay-button .switch-button.on:after,
    .widescreen-button .switch-button.on:after {
        left: 11px;
    }
    .autoplay-button .switch-button,
    .widescreen-button .switch-button {
        margin: 0 4px 0 0;
        display: inline-block;
        position: relative;
        width: 30px;
        height: 20px;
        border: 1px solid #ccc;
        outline: none;
        border-radius: 10px;
        box-sizing: border-box;
        background: #ccc;
        cursor: pointer;
        transition: border-color .2s,background-color .2s;
        vertical-align: middle;
        background-color: #9499A0;
        background-color: var(--text3);
        border: 1px px solid #9499A0;
        border: 1px solid var(--text3);
    }
    .autoplay-button .switch-button.on,
    .widescreen-button .switch-button.on {
        background-color: #00A1D6;
        border: 1px solid #00A1D6;
    }
    .autoplay-button .txt,
    .widescreen-button .txt {
        margin-right: 4px;
        vertical-align: middle;
    }
    .autoplay-button,
    .widescreen-button {
        font-size: 12px;
        line-height: 16px;
        color: #999999;
    }
    html.gray{
      -webkit-filter: grayscale(.0) !important;
      filter: none !important;
    }
  `)
  // 加载设置
  await SETTINGS.load()
  // 当前位于首页
  if (UI.isIndex()) {
    RECOMMAND.recommand()
    UI.listen()
  }
  // 当前位于视频页
  if (UI.isVideo()) {
    // 宽屏
    console.log(SETTINGS.widescreen)
    if (SETTINGS.widescreen) {
      waitForElm(UI.videoUIWidescreen.node).then(() => {
        document.querySelector(UI.videoUIWidescreen.node).click()
        scrollTo(0, 0) // 展开宽屏模式会看不见标题，回顶部
      })
    }
    // 自动播放
    console.log(SETTINGS.autoPlay)
    if (UI.isRecommand() && SETTINGS.autoPlay) {
      waitForElm(UI.videoUIPlay.node).then(() => {
        document.querySelector(UI.videoUIPlay.node).click()
      })
    }
  }
})()
