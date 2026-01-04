// ==UserScript==
// @name         Multipost VK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Multipost для Vk
// @author       ʄɛռɨx
// @match        https://vk.com/(Ваша страничка)
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/476939/Multipost%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/476939/Multipost%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';

   let wide_column = document.querySelector('#wide_column');
   let page_blocks = document.querySelectorAll('#wide_column > div');

   let future_post_module = createFuturePost();
   wide_column.insertBefore(future_post_module,page_blocks[1]);

})();

/**
 *  Эмуляция нажатия на элемент
 *  @param {DOMElement} element - узел на странице
 *  @return {boolean} - признак прохода события
 */
    function simulateClick(element) {
       var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
       });
       var canceled = !element.dispatchEvent(event);
       return canceled;
    }

/**
 *  Отправка отложенного сообщения на стене ВК
 *  @param {string} text - Текст для отправки на свою стену
 *  @param {number} date - timestamp в миллисекундах от 1970
 */
    function sendPost(text = 'test post from #userscript with #tampermonkey',date = new Date(2018,10,26,10,1).getTime() ){

		//let text = 'test with #tampermonkey #userscript',
		//	date = new Date(2018,10,26,10,1).getTime()/1000;

        let send_post = document.querySelector('#send_post');
        let post_field = document.querySelector('#post_field');
        let post_action_btn_layout = document.querySelectorAll('.post_action_btn_layout')[1];

        date /= 1000;

        post_field.focus();
        post_field.innerHTML = text;

        simulateClick(post_action_btn_layout);
        let postpone_date = document.querySelector('[id^=postpone_date]');
        postpone_date.value = date;

        send_post.click();
    }

/**
 * Создание вспомогательного блока для будущих новостей
 */
    function createFuturePost(){
  let page_block = document.createElement('div');
  page_block.className = 'page_block';

  page_block.innerHTML = `<div class="module clear future_post_module" id="profile_future_post_module">
  <a class="header_right_link fl_r" onclick="return false">вспомогательная ссылка</a>

<a href="#" onclick="return false" class="module_header">
  <div class="header_top clear_fix">
    <span class="header_label fl_l">Мои будущие новости</span>
    <span class="header_count fl_l">0</span>
  </div>
</a>

  <div id="page_future_post_module" class="page_future_post_module" style="padding: 13px 20px 20px;">
    <textarea id='future_post'  style="width:500px;min-height:200px"></textarea>
     <div class="add_future_post_button_wrap" >
      <button class="flat_button add_future_post_button" id="send_future_post" >Разместить</button>
    </div>
  </div>


</div>`;

  const future_post = page_block.getElementsByTagName('textarea')[0];
  future_post.addEventListener('keyup', e => {
    let header_count = page_block.getElementsByTagName('span')[1];
    let posts = e.target.value.split(/\n/gi);
    header_count.innerHTML = posts.length;
  } );

  const send_future_post = page_block.getElementsByTagName('button')[0];
  send_future_post.addEventListener('click', e => {
    const future_post = document.querySelector('#future_post');
    let posts = future_post.value.split(/\n/gi);
    let current = new Date();
    current.setHours(8);
    current.setMinutes(Math.round(Math.random()*30));

    let k = 1000 * 3600 * 24;
    posts.forEach( (post, i) => {
       let tmp = new Date(current.getTime() + (i+1)*k);
       sendPost(post, tmp.getTime());
    });

  });

  return page_block;
}