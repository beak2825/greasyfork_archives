// ==UserScript==
// @name         nyaa.si增强
// @namespace    http://nyaa.si/
// @version      0.2.1
// @description  即将滚动到底后，自动读取下一页内容，附带回顶按钮，表/里站页面结构一样，所以脚本通用
// @author       allence_frede
// @match        https://*.nyaa.si/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        none
// @license      GNU GPLV3
// @downloadURL https://update.greasyfork.org/scripts/448251/nyaasi%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448251/nyaasi%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  function keyFilter(obj=null) {
    let k = $('#showModal textarea').val()
    k_arr = k.split('\n')
    let a_tag = obj?obj:$('tbody>tr')
    a_tag.each(function (){
      if (k.length<=0) {
        $(this).show()
      } else {
        $(this).show()
        let t = $(this).find('td:nth-child(2)>a:last-child').attr('title').toLowerCase()
        let check = false
        k_arr.map(ki=>{
          if(ki && t.includes(ki.toLowerCase())) check = true
        })
        if (check) {
          $(this).hide()
        }
      }
    })
  }

  let lock = false
  window.addEventListener('scroll', async function () {
    if (lock) {
      return
    }
    if (window.pageYOffset + window.innerHeight >= window.document.querySelector('.table-responsive').scrollHeight) {
      lock = true
      let next_page = $('ul.pagination li:last-child a').attr('href')
      if (!next_page) {
        return
      }
      next_page = window.location.origin + next_page
      let res = await fetch(next_page)
      res = await res.text()
      let data_list = res.match(/<tbody>\n((.*\n)+)\s+<\/tbody>/)
      $('.table-responsive tbody').append(data_list[1])
      let pagination = res.match(/(<ul class="pagination">.*<\/ul>)/s)
      $('.pagination').replaceWith(pagination[1])
      keyFilter()
      lock = false
    }
  });
  window.addEventListener('scroll', function () {
    let have_el = Boolean($('#go-to-top').length)
    if (!have_el && window.pageYOffset >= 200) {
      let code = '<div id="go-to-top">\
        <div class="arrow"></div>\
      </div>\
      <style>\
        #go-to-top {\
          position: fixed;\
          bottom: 20px;\
          right: 20px;\
          width: 60px;\
          height: 60px;\
          border-radius: 50%;\
          background-color: pink;\
          cursor: pointer;\
          overflow: hidden;\
          display: flex;\
          justify-content: center;\
          align-items: center;\
        }\
        #go-to-top .arrow {\
          border-left: 3px solid #fff;\
          border-top: 3px solid #fff;\
          width: 28px;\
          height: 28px;\
          transform: rotate(45deg);\
          margin-top: 13px;\
        }\
      </style>'

      $('body').append(code)

      $('#go-to-top').on('click', function () {
        document.documentElement.scrollTop = document.body.scrollTop = 0
      })
    }

    if (have_el && window.pageYOffset < 200) {
      $('#go-to-top').remove()
    }
  });

  let modal_switch = true
  function showModal() {
    if (modal_switch) {
      $('#showModal').addClass('show')
      $('#showModal textarea').addClass('show')
      $('#showModal textarea').removeClass('default')
      modal_switch = false
    } else {
      $('#showModal').removeClass('show')
      $('#showModal textarea').addClass('default')
      $('#showModal textarea').removeClass('show')
      modal_switch = true
    }
  }
  //注入页面拓展元素
  let code = '<style>\
    #showModal.default {\
      position: fixed;\
      width: 130px;\
      top: 0;\
      left: 0;\
      z-index: 1001;\
      display: flex !important;\
      flex-direction: column;\
    }\
    #showModal.show {\
      background-color: #cf2d2d;\
    }\
    #showModal textarea.default {\
      display: none;\
    }\
    #showModal textarea.show {\
      width: 100%;\
      resize: none;\
      height: 150px;\
    }\
  </style>\
  <div id="showModal" class="default">\
    <button style="margin: 10px auto;">\
    排除关键词\
    </button>\
    <textarea class="default" placeholder="支持多个关键词，一行一个"></textarea>\
  </div>'
  $('body').append(code)
  $('#showModal button').on('click', function () {
    showModal()
  })
  $('#showModal textarea').on('change', function () {
    keyFilter()
  })
})();

