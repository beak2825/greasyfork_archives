// ==UserScript==
// @name         airflow helper
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  airflow helper :P
// @author       Kite
// @match        http://airflow.onework.yimian.com.cn/*
// @match        http://ym9041:18080/*
// @icon         https://www.google.com/s2/favicons?domain=yimian.com.cn
// @grant        none
// @license MIT
// ==/UserScript==
;(function () {
  'use strict'
  window.mark_success = function (
    localCsrfToken,
    dag_id,
    task_id,
    run_id,
  ) {
    const body_str_encoded = `csrf_token=${encodeURIComponent(localCsrfToken)}&dag_id=${encodeURIComponent(dag_id)}&dag_run_id=${encodeURIComponent(run_id)}&task_id=${encodeURIComponent(task_id)}&confirmed=true&past=false&upstream=false&future=false&downstream=false`
    console.log('Body:', body_str_encoded)
    const { origin, href } = window.location
    // debugger;
    const post_dict = {
      headers: {
        accept:'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-US;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded',
        'upgrade-insecure-requests': '1',
      },
      referrer: href,
      referrerPolicy: 'strict-origin-when-cross-origin',
      method: 'POST',
      redirect: 'manual',
      mode: 'cors',
      credentials: 'include',
    }
    post_dict.body = body_str_encoded
    return fetch(`${origin}/success`, post_dict)
      .then((response) => console.log(response.status))
      .catch((error) => {
        console.error('Error:', error)
      })
  }
 
  window.go_pikachu = function () {
    const localCsrfToken = csrfToken
    const dag_id = document.title.split(' ')[0]
    const task_id = document.querySelector('#root').shadowRoot.getElementById('sunny_task_id').value
		const lang =  navigator.language || navigator.userLanguage || 'zh-CN'
		if (!task_id) {
			alert( /en/.test(lang) ? 'Pleas enter the task_id' : '请输入task_id' )
			return
		}
    let task_replace_id = null
    if (task_id.includes('latest_only')) {
      task_replace_id = task_id.split('latest_only')[0] + 'latest_only'
    } else {
      task_replace_id = task_id
    }
		const num_runs = document.querySelector('#root').shadowRoot.querySelector('.chakra-select.c-s4irmj').value
    const { origin } = window.location
		fetch(`${origin}/object/grid_data?dag_id=${dag_id}&num_runs=${num_runs}`).then(response => response.json())
		.then((res) => {
      const promises = res.dag_runs.map(row => mark_success(localCsrfToken, dag_id, task_replace_id, row.run_id))
      Promise.all(promises).then(() => {
        console.log('all promises are success');
        window.location.reload()
        task_id.value = ''
      })
		})
		.catch((error) => {
			console.error('Error:', error)
		})
  }
 
  function createElementFromHTML(htmlString) {
    var div = document.createElement('div')
    div.innerHTML = htmlString.trim()
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild
  }
 
  window.gethoverBtnStyle = function (flag) {
    const btn = document.querySelector('#root').shadowRoot.querySelector('.mark_success_btn')
    btn.style['background-color'] = flag ? '#c0defb' : '#fff'
  }
 
  // 创建一个观察器实例并传入回调函数
  const observer = new MutationObserver(addMarkSuccessButton);
 
  function addMarkSuccessButton() {
    // 避免重复插入
    const fionaDOM = document.querySelector('#root').shadowRoot.querySelector('#fiona')
    if (fionaDOM) {
      observer.disconnect();
      return
    }
    const htmlString =
      `<div id="fiona" style="margin-top: 20px">
	      <div>
          <label for="task_id">input task_id </label>
          <br>
          <input type="text" name="" id="sunny_task_id" style="border: 1px solid #333; padding: 1px 2px; width: 200px">
		    </div>
	      <button
          class="mark_success_btn"
          onclick="go_pikachu()"
          style="margin-top: 5px; padding: 6px 12px; background: #fff; border: 1px solid #017cee; color: #017cee;"
          onmouseover="gethoverBtnStyle(true)"
          onmouseout="gethoverBtnStyle(false)"
        >
		      GO mark success
	      </button>
	    </div>`
    const el = createElementFromHTML(htmlString)
    try {
      const grid_wrap = document.querySelector('#root').shadowRoot.querySelector('.c-1wkamjr') ||
        document.querySelector('#root').shadowRoot.querySelector('.c-1kq3bwj')
      grid_wrap.appendChild(el)
      // 插入DOM后，停止观察
      observer.disconnect();
    } catch (error) {
      console.warn(error)
    }
  }
 
  function observeTargetDOM() {
    const grid_wrap = document.querySelector('#root').shadowRoot
    const config = { attributes: true, childList: true, subtree: true };
    // 以上述配置开始观察目标节点
    observer.observe(grid_wrap, config);
  }
  
 
  function mainEntry() {
    if (window.location.href.includes('grid')) {
      observeTargetDOM()
    }
  }
  
  mainEntry()
  window.addEventListener("load", mainEntry);
  // Your code here...
})();