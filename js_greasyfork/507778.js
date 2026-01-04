// ==UserScript==
// @name         metruyencv.com Downloader
// @version      0.1
// @description  Tải truyện tại metruyencv thông qua tool api
// @author       0x4076696e63766e
// @match        *://metruyencv.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValues
// @run-at    document-idle
// @license      GPL-3.0
// @namespace https://greasyfork.org/users/1356506
// @downloadURL https://update.greasyfork.org/scripts/507778/metruyencvcom%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/507778/metruyencvcom%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $API = `http://localhost:28686`;
    const $SO_TU_TU_DONG = 1000; // nếu chapContent vượt quá số từ này thì gửi thông tin đến app luôn
    // thời gian ở dưới tính theo ms
    const $DELAY_CHECK = 3000; //thời gian delay đến mỗi chương setTimeout để kiểm tra số từ ở trên
    const $DELAY_NEXt = 60000; //thời gian tạm dừng chờ trả kết quả break nếu vượt quá thời gian này mà web vẫn chưa trả kết quả về thì next chương
    function toggle_data({title, content}){
      const book = get_book();
      if(book && title && content){
        title = title.trim();
        content = content.trim();
        sync({book, title, content}).finally(()=>{
          let urls = load_urls(window.location.href);
          save_urls(book, urls);
          if(urls[0]){
            window.location.href=urls[0];
          }
          else{
            go_back();
            clear_value();
          }
        });
      }else{
        alert(`Không đầy đủ thông tin không thể tiếp tục tải`);
      }
    }
    function go_back(){
       const link_truyen = GM_getValue('link_truyen', '');
      if(link_truyen && link_truyen !== ''){
        window.location.href = link_truyen;
      }
    }
    function clear_value(){
        GM_deleteValues(["book", "saved_urls", "link_truyen"]);
    }
    function do_next(){
      const book = get_book();
      let urls = load_urls(window.location.href);
      save_urls(book, urls);
      if(urls[0]){
        window.location.href=urls[0];
      }
      else{
        go_back();
        alert("Completed !!!");
        clear_value();
      }
    }
    function get_content(){
      const currentUrl = window.location.href;
      const h2Element = document.querySelector('h2.text-center.text-gray-600.dark\\:text-gray-400.text-balance');
      const h2Content = h2Element ? h2Element.textContent : null;
      const divElement = document.querySelector('div[data-x-bind="ChapterContent"]');
      const divContent = divElement ? divElement.innerHTML : null;
      const load_more = document.getElementById("load-more");
      if (load_more) {
          setTimeout(()=>{
            if(dem_tu() > $SO_TU_TU_DONG){
              get_single_content();
            }
          }, $DELAY_CHECK);
          const do_next_on_error = setTimeout(()=>{
            do_next();
          }, $DELAY_NEXt);
          const observer = new MutationObserver((mutationsList, observer) => {
              var is_detected = false;
              var new_content = '';
              mutationsList.forEach((mutation) => {
                  if (mutation.type === 'childList' || mutation.type === 'subtree') {
                      const load_more_content = load_more.textContent;
                      if (load_more_content) {
                          new_content = `${divContent}${load_more_content}`
                          is_detected = true;
                          observer.disconnect();
                      }
                  }
              });
              if(is_detected){
                clearTimeout(do_next_on_error);
                toggle_data({title: h2Content, content: new_content});
              }
          });
          observer.observe(load_more, { childList: true, subtree: true });
      }else{
        toggle_data({title: h2Content, content: divContent})
      }
    }
    function save_urls(book, urls) {
      GM_setValues({book: book, saved_urls: urls});
    }
    function get_book(){
        return GM_getValue('book', '');
    }
    function load_urls(removeUrl = null) {
        // Lấy danh sách URLs đã lưu từ GM storage
        const urls = GM_getValue('saved_urls', []);

        // Nếu có tham số removeUrl, loại bỏ URL đó khỏi danh sách
        if (removeUrl) {
            const filteredUrls = urls.filter(url => url !== removeUrl);
            return filteredUrls;
        }

        // Nếu không có tham số removeUrl, trả về danh sách URLs ban đầu
        return urls;
    }
    function ask_chapter(){
      const input = prompt("Nhập vào danh sách các chapter, ngăn cách bởi dấu phẩy (,)");
      const chapters = input.split(',').map(chapter => chapter.trim());
      if(chapters.length > 0){
        GM_setValue('link_truyen', window.location.href);
        start_download(chapters);
      }
    }
    function isIncorrect(){
      return get_last_url().includes("chuong-");
    }
    function get_last_url(){
      const currentUrl = window.location.href;
      const urlParts = currentUrl.split('/');
      const last_part = urlParts[urlParts.length - 1];
      return last_part;
    }
    async function sync(data = { book, title, content }) {
        try {
            const response = await fetch(`${$API}/sync`, {
                method: 'POST', // Chỉ định phương thức HTTP
                headers: {
                    'Content-Type': 'application/json', // Đặt content type là application/json
                },
                body: JSON.stringify(data) // Chuyển đổi dữ liệu thành chuỗi JSON
            });

            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Nếu cần, bạn có thể xử lý thêm phản hồi từ server
            const result = await response.json(); // Giả sử server trả lại JSON
            return result; // Trả về kết quả
        } catch (error) {
            console.error('Error syncing data:', error, data);
            throw error; // Ném lại lỗi để có thể xử lý ở nơi khác nếu cần
        }
    }
    async function get_error_chapters(){
      try{
         const response = await fetch(`${$API}/error-chapters`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text(); // Giả sử server trả lại JSON
        return result; // Trả về kết quả
      }catch(err){
        console.log(err)
        return ""
      }
    }
    async function start_download(chapters) {
      const book = get_last_url();
      let chapters_url = [];
      for (const chapter of chapters) {
          let new_url = `${window.location.href}/chuong-${chapter}`;
          chapters_url.push(new_url)
      }
      save_urls(book, chapters_url);
      window.location.href = chapters_url[0];
    }
    async function send_server() {
        try {
            const data = {
              url: window.location.href
            }
            const response = await fetch(`${$API}/task`, {
                method: 'POST', // Chỉ định phương thức HTTP
                headers: {
                    'Content-Type': 'application/json', // Đặt content type là application/json
                },
                body: JSON.stringify(data) // Chuyển đổi dữ liệu thành chuỗi JSON
            });

            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Nếu cần, bạn có thể xử lý thêm phản hồi từ server
            const result = await response.json(); // Giả sử server trả lại JSON
            return result; // Trả về kết quả
        } catch (error) {
            console.error('Error syncing data:', error);
            throw error; // Ném lại lỗi để có thể xử lý ở nơi khác nếu cần
        }
    }
    async function send_cookie(cookie) {
        try {
            const data = {
              cookie,
            }
            const response = await fetch(`${$API}/cookie`, {
                method: 'POST', // Chỉ định phương thức HTTP
                headers: {
                    'Content-Type': 'application/json', // Đặt content type là application/json
                },
                body: JSON.stringify(data) // Chuyển đổi dữ liệu thành chuỗi JSON
            });

            // Kiểm tra phản hồi từ server
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.text();
            if(result === 'OK'){
              alert('DONE');
            }
        } catch (error) {
            console.error('Error syncing data:', error);
            throw error; // Ném lại lỗi để có thể xử lý ở nơi khác nếu cần
        }
    }
    function get_single_content(){
        const currentUrl = window.location.href;
        const h2Element = document.querySelector('h2.text-center.text-gray-600.dark\\:text-gray-400.text-balance');
        const h2Content = h2Element ? h2Element.textContent : null;
        const divElement = document.querySelector('div[data-x-bind="ChapterContent"]');
        const divContent = divElement ? divElement.innerHTML : null;
        if(h2Content && divContent){
          toggle_data({title: h2Content, content: divContent})
        }
    }
    function dem_tu(){
      const divElement = document.querySelector('div[data-x-bind="ChapterContent"]');
      const divContent = divElement ? divElement.innerHTML : null;
      if(divContent){
        return divContent.split(' ').length;
      }
      return 0;
    }
    function getCookie(){
      return document.cookie;
    }
    function inject_download_button(){
        const targetElement = document.querySelector(`button[data-x-bind="OpenTicket(book, ticketOpts)"]`);

        if (targetElement) {
            const parentElement = targetElement.parentElement;
            if(parentElement){
              const class_name = 'flex border border-title rounded px-2 py-1 mx-2 my-2 text-title';
              const buttons = [
                { text: 'Gửi Cookie', action: async () => {
                    const cookie = getCookie();
                    await send_cookie(cookie);
                }},
                { text: 'Tải Truyện (Tool)', action: send_server },
                { text: 'Tải chương lỗi (Auto)', action: async () => {
                    const result = await get_error_chapters();
                    const chapters = result.split(',').map(chapter => chapter.trim());
                    if(chapters.length > 0){
                      GM_setValue('link_truyen', window.location.href);
                      start_download(chapters);
                    }
                }},
                { text: 'Tải chương lỗi (Manual)', action: ask_chapter },
              ];

              buttons.forEach(({ text, action }) => {
                const button = document.createElement('button');
                button.className = class_name;
                button.innerHTML = `<span class="flex items-center">${text}</span>`;
                parentElement.appendChild(button);
                button.addEventListener('click', action);
              });
            }
        }
        if(isIncorrect()){
          const targetElement2 = document.querySelector(`button[data-x-bind="BookmarkToggle"]`);
          if(targetElement2){
              const parentElement = targetElement2.parentElement;
              if(parentElement){
                const button = document.createElement('button');
                const class_name = 'border border-title rounded px-2 py-1 text-title';
                button.className = class_name;
                button.innerHTML = `<span class="flex items-center">Tải Truyện (${dem_tu()})</span>`;
                parentElement.appendChild(button);
                button.addEventListener('click', get_single_content);
              }
          }
        }
    }
    function inject(){
      const urls = load_urls();
      if(urls.includes(window.location.href)){
        get_content();
      }
    }
    inject();
    inject_download_button();
})();
