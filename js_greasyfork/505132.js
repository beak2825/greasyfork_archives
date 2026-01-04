// ==UserScript==
// @name  Bangumi Sakana Widget
// @version 0.0.2
// @description Introduce Sakana-Widget to Bangumi!
// @author Flynn Cao
// @namespace https://flynncao.uk/
// @match  https://bangumi.tv/*
// @match  https://chii.in/*
// @match  https://bgm.tv/*
// @include /^https?:\/\/(((fast\.)?bgm\.tv)|chii\.in|bangumi\.tv)*/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505132/Bangumi%20Sakana%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/505132/Bangumi%20Sakana%20Widget.meta.js
// ==/UserScript==

;(async function () {
  const mediaQueryResult = window.matchMedia('(max-width: 700px)')
  if (window.location !== window.parent.location) {
    // if the script is running in an iframe, cancel the execution
    return
  }
  const NAMESPACE = 'BangumiSakanaWidget'
  function setLocalStorageKey(key, value) {
    localStorage.setItem(`${NAMESPACE}_${key}`, JSON.stringify(value))
  }
  function getLocalStorageKey(key) {
    const value = localStorage.getItem(`${NAMESPACE}_${key}`)
    return value ? JSON.parse(value) : undefined
  }
  async function initStorage() {
    const keys = Object.keys(settings)
    for (let key of keys) {
      const value = getLocalStorageKey(key)
      if (value === undefined) {
        setLocalStorageKey(key, settings[key])
      }
    }
  }
  const settings = {
    muted: false,
    displayMode: 1, // 0 for always hide, 1 for hide on mobile, 2 for show on all devices
  }
  async function setStorageKey(key, value) {
    setLocalStorageKey(key, value)
  }
  async function getStorageKey(key) {
    return getLocalStorageKey(key)
  }
  await initStorage()
  const userSettings = {
    muted: await getStorageKey('muted'),
    displayMode: await getStorageKey('displayMode'),
  }
  // Initialize the widgets
  const el = document.createElement('div')
  const script = document.createElement('script')
  const css = document.createElement('link')
  const modal = document.createElement('div')
  const settingBtn = document.createElement('div')
  settingBtn.id = 'sakana-setting-btn'
  settingBtn.className = 'sakana-widget-ctrl-item'
  settingBtn.innerHTML = `<svg t="1739528129330" class="sakana-widget-icon" role="button" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2038" data-darkreader-inline-fill="" width="256" height="256"><path fill="currentColor" d="M 501.76 385.024 c -70.0416 0 -126.976 56.9344 -126.976 126.976 s 56.9344 126.976 126.976 126.976 s 126.976 -56.9344 126.976 -126.976 s -56.9344 -126.976 -126.976 -126.976 Z m 0 204.8 c -43.008 0 -77.824 -34.816 -77.824 -77.824 s 34.816 -77.824 77.824 -77.824 s 77.824 34.816 77.824 77.824 s -34.816 77.824 -77.824 77.824 Z M 279.962 556.032 a 20.48 20.48 0 0 0 18.2272 -22.528 c -0.8192 -7.168 -1.2288 -14.336 -1.2288 -21.504 c 0 -11.264 -9.216 -20.48 -20.48 -20.48 s -20.48 9.216 -20.48 20.48 c 0 8.8064 0.4096 17.408 1.4336 25.8048 c 1.024 10.4448 10.0352 18.432 20.2752 18.432 c 0.6144 0 1.4336 -0.2048 2.2528 -0.2048 Z M 501.76 716.8 c -66.3552 0 -129.024 -32.5632 -167.526 -87.2448 c -9.6256 -13.7216 -17.6128 -28.4672 -23.552 -43.8272 a 20.3366 20.3366 0 0 0 -26.4192 -11.6736 c -10.4448 4.096 -15.7696 15.9744 -11.6736 26.4192 c 7.168 18.6368 16.7936 36.2496 28.2624 52.6336 c 46.2848 65.536 121.242 104.653 200.909 104.653 c 11.264 0 20.48 -9.216 20.48 -20.48 s -9.216 -20.48 -20.48 -20.48 Z M 501.76 266.24 c -11.264 0 -20.48 9.216 -20.48 20.48 s 9.216 20.48 20.48 20.48 c 112.845 0 204.8 91.9552 204.8 204.8 c 0 11.264 9.216 20.48 20.48 20.48 s 20.48 -9.216 20.48 -20.48 c 0 -135.578 -110.182 -245.76 -245.76 -245.76 Z" p-id="2039"></path><path fill="currentColor" d="M 868.966 512.819 c 0 -19.6608 -1.6384 -39.3216 -4.9152 -58.9824 c 48.128 -40.3456 61.0304 -110.797 29.4912 -165.274 c -31.5392 -54.8864 -99.5328 -78.848 -158.72 -56.7296 a 362.127 362.127 0 0 0 -105.062 -60.6208 c -10.8544 -61.6448 -65.536 -107.93 -128.205 -107.93 c -62.6688 0 -117.35 46.2848 -128.205 107.93 c -37.888 13.9264 -73.1136 34.2016 -105.062 60.416 c -59.1872 -22.1184 -126.976 2.048 -158.72 56.7296 c -31.3344 54.4768 -18.6368 124.928 29.4912 165.274 a 356.352 356.352 0 0 0 0 117.965 c -48.128 40.3456 -61.0304 110.797 -29.4912 165.274 c 31.5392 54.6816 99.5328 78.848 158.72 56.7296 c 31.9488 26.2144 67.3792 46.6944 105.472 60.6208 c 11.8784 61.44 65.1264 105.882 127.795 105.882 s 115.917 -44.4416 127.795 -105.882 a 367.616 367.616 0 0 0 105.472 -60.6208 c 59.1872 22.1184 126.976 -2.048 158.72 -56.7296 c 31.3344 -54.4768 18.6368 -124.928 -29.4912 -165.274 c 3.2768 -19.2512 4.9152 -39.1168 4.9152 -58.7776 Z m -17.8176 199.68 c -19.8656 34.6112 -63.0784 49.3568 -100.352 34.816 c -15.1552 -6.144 -32.9728 -2.8672 -46.4896 8.192 c -28.0576 23.1424 -58.9824 40.96 -92.3648 53.248 c -15.9744 5.9392 -27.648 19.2512 -30.5152 35.0208 c -6.7584 39.1168 -40.3456 67.584 -79.872 67.584 s -72.9088 -28.4672 -79.872 -67.584 c -2.6624 -15.7696 -14.336 -29.2864 -30.5152 -35.0208 c -33.3824 -12.0832 -64.3072 -30.1056 -92.3648 -53.0432 c -9.0112 -7.3728 -19.6608 -11.264 -30.5152 -11.264 c -5.5296 0 -10.8544 1.024 -15.9744 3.072 c -37.2736 14.7456 -80.4864 -0.2048 -100.352 -34.816 c -19.8656 -34.2016 -11.264 -78.848 19.6608 -103.834 c 12.6976 -10.24 18.8416 -27.0336 15.9744 -44.2368 a 311.583 311.583 0 0 1 0 -103.219 c 2.8672 -16.9984 -3.2768 -33.9968 -15.9744 -44.2368 c -31.1296 -24.9856 -39.5264 -69.632 -19.6608 -103.834 c 19.8656 -34.6112 63.0784 -49.5616 100.352 -34.816 c 15.1552 5.9392 32.9728 2.8672 46.4896 -8.192 c 27.8528 -23.1424 58.7776 -40.96 91.9552 -53.0432 c 16.384 -5.9392 28.0576 -19.6608 30.5152 -35.84 c 6.144 -39.3216 40.5504 -68.8128 80.0768 -68.8128 s 73.9328 29.696 80.0768 68.8128 c 2.4576 16.1792 14.1312 29.696 30.5152 35.84 c 33.1776 12.0832 64.1024 29.9008 91.9552 53.0432 c 13.5168 11.0592 31.3344 14.1312 46.4896 8.192 c 37.2736 -14.7456 80.4864 0.2048 100.352 34.816 c 19.8656 34.2016 11.264 78.848 -19.6608 103.834 c -12.6976 10.24 -18.8416 27.0336 -15.9744 44.2368 a 311.583 311.583 0 0 1 0 103.219 c -2.8672 16.9984 3.2768 33.9968 15.9744 44.2368 c 31.3344 24.7808 39.936 69.4272 20.0704 103.629 Z" p-id="2040"></path></svg>`
  settingBtn.onclick = function () {
    if (document.getElementById('sakana-modal').style.display === 'none') {
      document.getElementById('sakana-modal').style.display = 'block'
    }
  }
  const muteBtn = document.createElement('div')
  muteBtn.id = 'sakana-mute-btn'
  muteBtn.className = 'sakana-widget-ctrl-item'
  muteBtnSVGArr = [
    '<svg  class="sakana-widget-icon" role="button"  t="1739537338687" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2365" data-darkreader-inline-fill="" width="256" height="256"><path fill="currentColor" d="M 843.366 739.738 l -95.6416 -127.59 V 369.254 c 0 -118.989 -84.992 -218.522 -197.222 -241.05 c 0 -2.4576 -0.2048 -5.12 -0.8192 -7.5776 a 68.1984 68.1984 0 0 0 -2.6624 -9.216 a 47.5341 47.5341 0 0 0 -10.6496 -15.7696 c -18.2272 -18.2272 -50.7904 -18.2272 -69.0176 0 c -2.4576 2.2528 -4.5056 4.7104 -6.3488 7.3728 c -1.8432 2.6624 -3.072 5.5296 -4.5056 8.3968 c -1.2288 2.8672 -2.048 6.144 -2.6624 9.216 c -0.4096 2.4576 -0.6144 5.12 -0.8192 7.5776 c -112.435 22.7328 -197.222 122.061 -197.222 241.05 v 242.893 l -95.6416 127.59 c -14.5408 19.456 -16.7936 45.056 -5.9392 66.7648 s 32.768 35.2256 56.9344 35.2256 h 189.85 c 8.8064 47.7184 50.7904 83.968 100.966 83.968 s 91.9552 -36.2496 100.966 -83.968 h 189.85 c 24.3712 0 46.08 -13.5168 56.9344 -35.2256 s 8.192 -47.3088 -6.3488 -66.7648 Z M 501.76 876.544 c -22.9376 0 -42.3936 -14.5408 -50.176 -34.816 h 100.147 c -7.5776 20.2752 -27.0336 34.816 -49.9712 34.816 Z m 303.718 -91.9552 c -1.2288 2.4576 -4.9152 7.9872 -13.1072 7.9872 H 211.149 c -8.192 0 -11.8784 -5.5296 -13.1072 -7.9872 a 13.9674 13.9674 0 0 1 1.4336 -15.1552 l 105.472 -140.698 V 369.254 c 0 -108.544 88.2688 -196.813 196.813 -196.813 s 196.813 88.2688 196.813 196.813 v 244.531 c 0 9.4208 3.072 18.8416 8.8064 26.4192 l 96.6656 129.024 c 4.9152 6.5536 2.6624 12.9024 1.4336 15.36 Z" p-id="2366"></path></svg>',
    '<svg class="sakana-widget-icon" role="button"  t="1739537383729" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2512" data-darkreader-inline-fill="" width="256" height="256"><path fill="currentColor"  d="M 879.206 271.77 c -6.3488 -12.0832 -21.2992 -16.5888 -33.1776 -10.24 L 134.554 637.133 c -12.0832 6.3488 -16.5888 21.2992 -10.24 33.1776 c 4.3008 8.3968 12.9024 13.1072 21.7088 13.1072 c 3.8912 0 7.7824 -0.8192 11.4688 -2.8672 l 711.475 -375.808 c 12.0832 -6.144 16.5888 -21.0944 10.24 -32.9728 Z M 756.736 654.336 V 429.466 c 0 -13.5168 -11.0592 -24.576 -24.576 -24.576 s -24.576 11.0592 -24.576 24.576 v 226.509 c 0 9.4208 3.072 19.0464 8.8064 26.624 l 97.6896 130.253 c 4.9152 6.7584 2.6624 13.1072 1.4336 15.5648 s -5.12 8.192 -13.312 8.192 H 214.835 c -8.3968 0 -12.0832 -5.7344 -13.312 -8.192 a 14.2336 14.2336 0 0 1 1.4336 -15.5648 l 101.581 -135.578 c 8.192 -10.8544 5.9392 -26.2144 -4.9152 -34.4064 c -10.8544 -8.192 -26.2144 -5.9392 -34.4064 4.9152 l -101.581 135.578 c -14.7456 19.456 -16.9984 45.2608 -6.144 67.1744 a 63.6518 63.6518 0 0 0 57.344 35.4304 h 191.898 a 103.588 103.588 0 0 0 101.786 84.7872 c 50.7904 0 92.7744 -36.6592 101.786 -84.7872 h 191.898 c 24.3712 0 46.4896 -13.5168 57.344 -35.4304 c 10.8544 -21.9136 8.6016 -47.5136 -6.144 -67.1744 l -96.6656 -129.024 Z M 508.518 921.6 c -23.3472 0 -43.2128 -14.9504 -50.9952 -35.6352 h 101.786 A 54.231 54.231 0 0 1 508.518 921.6 Z M 284.877 528.998 c 13.5168 0 24.576 -11.0592 24.576 -24.576 v -95.4368 c 0 -109.773 89.2928 -199.066 199.066 -199.066 a 197.632 197.632 0 0 1 169.165 94.208 c 7.168 11.4688 22.3232 15.1552 33.792 7.9872 c 11.4688 -7.168 15.1552 -22.3232 7.9872 -33.792 c -36.864 -59.1872 -95.232 -98.9184 -161.792 -112.23 c 0 -2.8672 -0.2048 -5.7344 -0.8192 -8.3968 c -0.6144 -3.072 -1.6384 -6.3488 -2.8672 -9.216 c -1.024 -2.8672 -2.6624 -5.7344 -4.3008 -8.3968 c -1.8432 -2.8672 -3.8912 -5.12 -6.144 -7.5776 c -18.432 -18.432 -51.4048 -18.432 -69.8368 0 c -2.4576 2.4576 -4.5056 4.7104 -6.3488 7.5776 c -1.8432 2.6624 -3.072 5.5296 -4.5056 8.3968 c -1.2288 3.072 -2.2528 6.144 -2.6624 9.216 c -0.4096 2.6624 -0.8192 5.3248 -0.8192 7.9872 c -113.254 22.9376 -198.861 123.29 -198.861 243.302 v 95.4368 c -0.2048 13.7216 10.8544 24.576 24.3712 24.576 Z" p-id="2513"></path></svg>',
  ]
  muteBtn.innerHTML = muteBtnSVGArr[0]
  muteBtn.onclick = function () {
    alert('此功能暂未开放')
    // if(userSettings.muted) {
    //   userSettings.muted = false
    //   setStorageKey('muted', false)
    //   muteBtn.innerHTML = muteBtnSVGArr[0]
    // } else {
    //   setStorageKey('muted', true)
    //   userSettings.muted = true
    //   muteBtn.innerHTML = muteBtnSVGArr[1]
    // }
  }
  modal.id = 'sakana-modal'
  modal.style.display = 'none'
  modal.innerHTML = `
    <div class="sakana-modal-content">
      <h1>设置</h1>
      <br>
      <div class="sakana-modal-item"> 
        <label for="displayMode">小组件显示模式:</label>
        <select id="displayMode">
          <option value="0">始终隐藏</option>
          <option value="1">在移动端隐藏</option>
          <option value="2">始终显示</option>
        </select> 
        </div>
        <br> 
        <p class="sakana-modal-item"><a id="sakana-setting-save-btn" class="button">保存</a><a id="sakana-setting-close-btn" class="button">关闭<a></p>
    </a>
   `

  document.styleSheets[0].insertRule(`
	 #sakana-widget {
		  position: fixed;
			bottom: 22px;
			left: 50px;
			z-index: 91;
		}
		`)
  document.styleSheets[0].insertRule(`
    #sakana-modal {
      display: hidden;
      position: fixed;
      z-index: 100;
      left: 50vw;
      top: 50vh;
      transform: translate(-50%, -50%);
      min-width: 336px;
      min-height: 189px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #eee;
      border-radius: 3px;
    }
  `)
  document.styleSheets[0].insertRule(`
    .sakana-modal-content {
      background-color: transparent;
      margin: 15% auto;
      margin-top: 5%;
      padding: 20px;
      width: 80%;
    }
  `)
  document.styleSheets[0].insertRule(`
    .sakana-modal-item  {
      display: flex;
      margin: 10px 0;
    }`)
  document.styleSheets[0].insertRule(`
    .sakana-modal-item .button {
      font-size: 1.25rem;
      margin-right: 10px;
      cursor: pointer; 
    }`)
  const showSakanaWidgetBtn = document.createElement('li')
  showSakanaWidgetBtn.id = 'show-sakana-widget-btn'
  showSakanaWidgetBtn.className = 'last'
  showSakanaWidgetBtn.innerHTML = '<a href="javascript:void(0)">显示石蒜</a>'
  showSakanaWidgetBtn.onclick = function () {
    document.getElementById('sakana-widget').style.display = 'block'
    showSakanaWidgetBtn.style.display = 'none'
  }

  // Main Container
  el.id = 'sakana-widget'
  document.body.appendChild(el)
  css.rel = 'stylesheet'
  css.href = 'https://cdn.jsdelivr.net/npm/sakana-widget-z@1.0.3/lib/sakana.min.css'
  script.type = 'text/javascript'
  script.src = 'https://cdn.jsdelivr.net/npm/sakana-widget-z@1.0.3/lib/sakana.min.js'
  script.async = true
  // Load the widget
  script.onload = function () {
    const takina = SakanaWidget.getCharacter('takina')
    SakanaWidget.registerCharacter('takina-default', takina)
    new SakanaWidget({ character: 'takina' }).mount('#sakana-widget')
    document.getElementsByClassName('sakana-widget-ctrl')[0].appendChild(muteBtn)
    document.getElementsByClassName('sakana-widget-ctrl')[0].appendChild(settingBtn)
  }
  // Append the elements
  document.head.appendChild(css)
  document.body.appendChild(script)
  document.body.appendChild(modal)
  document.getElementById('sakana-setting-save-btn').onclick = function () {
    userSettings.displayMode = document.getElementById('displayMode').value
    setStorageKey('displayMode', userSettings.displayMode)
    alert('设置已保存')
    document.getElementById('sakana-modal').style.display = 'none'
    window.location.reload()
  }
  document.getElementById('sakana-setting-close-btn').onclick = function () {
    document.getElementById('sakana-modal').style.display = 'none'
  }
  document.getElementById('displayMode').value = userSettings.displayMode
  if (userSettings.displayMode === '0') {
    // hide all
    el.style.display = 'none'
  } else if (userSettings.displayMode === '1' && mediaQueryResult.matches) {
    // hide on mobile
    el.style.display = 'none'
  } else {
    // show all
    el.style.display = 'block'
  }
  document.getElementById('dock').getElementsByTagName('ul')[0].appendChild(showSakanaWidgetBtn)
})()
