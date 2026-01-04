// ==UserScript==
// @name         caoliu
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  caoliu site:ca.ipfs.eu.org  https://cc.9385x.xyz/
// @require      https://code.jquery.com/jquery-1.8.3.min.js
// @author       gsons
// @match        https://*/thread0806.php?fid=*
// @homepageURL  https://cc.9385x.xyz/
// @homepageURL  https://ca.ipfs.eu.org/
// @connect      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514926/caoliu.user.js
// @updateURL https://update.greasyfork.org/scripts/514926/caoliu.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let _count = 3;

  function GMFetch(url, options = {}) {
    return new Promise((resolve, reject) => {
      const { method = 'GET', headers = {}, data = null } = options;
      const requestOptions = {
        method: method.toUpperCase(),
        headers: headers,
        url: url,
        onload: (response) => {
          if (response.status >= 200 && response.status < 400) {
            resolve(response.responseText);
          } else {
            reject(response.statusText);
          }
        },
        onerror: (error) => {
          reject(error);
        },
      };
      if (method.toUpperCase() === 'POST') {
        requestOptions.data = data;
      }
      GM_xmlhttpRequest(requestOptions);
    });
  }

  async function get_images(url) {
    let real_url = url;
    const pcOpt = { headers: { "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/113.0.0.0" } };
    if (/read\.php/.test(url)) {
      let res0 = await fetch(real_url, pcOpt);
      const html_txt = await res0.text();
      real_url = $(html_txt).find('a').eq(1).attr('href');
      console.log('real_url', real_url);
    }
    const resp = await fetch(real_url, pcOpt);
    const html = await resp.text();

    let links0 = [];
    $(html).find('img[ess-data]').each(function () {
      links0.push($(this).attr('ess-data'));
    });
    //links0=links0.sort(() => Math.random() - 0.5);

    let links1 = [];
    $(html).find('.cl-gallery a').each(function () {
      links1.push($(this).attr('href'));
    });
    //links1=links1.sort(() => Math.random() - 0.5);
    return [...links0, ...links1].filter(v => { return /\.(jpg|png|jpeg|bmp)/.test(v) || /\d+\/\d+\/\d+.*\.gif/.test(v) });
  }

  function preLoadImg(id, url) {
    console.log("preLoadImg", id, url);
    var img = new Image();
    img.src = url;
    img.onload = function () {
      document.getElementById(id).src = url;
    };
    img.onerror = function () {
      document.getElementById(id).src = "https://cosmic-dieffenbachia-e06779.netlify.app/img/404.png";
    }
  }

  function lazyLoad() {
    const lazyDivs = $(".img-list[data-href]");
    lazyDivs.each(async (i, div) => {
      const divTop = div.getBoundingClientRect().top;
      const divBottom = div.getBoundingClientRect().bottom;
      const winTop = window.innerHeight;
      if (divTop < winTop && divBottom > 0) {
        const href = $(div).data('href');
        const index = $(div).data('index');
        $(div).removeAttr("data-href");
        const links = await get_images(href);
        console.log([href, links]);
        let count = links.length;
        $(div).parent().find('p').append(`<b>[${count}P]</b>`);
        while (count++ < _count) {
          const img_id = `id_${index}_img_${count - 1}`;
          $('#' + img_id).remove();
          //links.push("https://cosmic-dieffenbachia-e06779.netlify.app/img/404.png");
        }
        links.slice(0, _count).forEach((link, _index) => {
          const dom_id = `id_${index}_img_${_index}`;
          preLoadImg(dom_id, link);
        });
      }
    });
  }



  function debounce(fn, delay) {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    };
  }

  $(() => {
    $("#header").css('max-width', '1500px');
    $("#main").css('max-width', '1500px');
    $('.tac').nextAll().addClass('tac_title')

    const lazyLoadDebounced = debounce(lazyLoad, 60);
    window.addEventListener('scroll', lazyLoadDebounced);


    $('table #tbody h3 a').each(async function (index, vo) {//
      let container = $(this).parent().parent().parent().after(`<tr><td colspan="6"><div class="img-list" style="width: 100%; padding-top:10px;overflow-x: auto; overflow-y: hidden;height:250px; white-space: nowrap; "></div></td><tr>`);
      const defaultImg = "https://cosmic-dieffenbachia-e06779.netlify.app/img/load.gif";
      let i = 0;
      while (i++ < _count) {
        container.next().find(".img-list").append(`<img src="${defaultImg}" id="id_${index}_img_${i - 1}" style="height: 250px; display: inline-block;padding:0 5px"/>`);
      }
      //console.log(container.html());
      let url = $(this).attr('href');
      url = 'https://' + location.host + '/' + url;
      container.next().find(".img-list").attr("data-href", url).attr('data-index', index);
      lazyLoad();
    });


    $('.list.t_one a').each(async function (index, vo) {
      _count = 2;
      let container = $(this).parent().append(`<div class="img-list" style="width: 100%; height:250px;padding-top:10px;overflow-x: auto; overflow-y: hidden; white-space: nowrap;"></div>`);
      const defaultImg = "https://cosmic-dieffenbachia-e06779.netlify.app/img/load.gif";
      let i = 0;
      while (i++ < _count) {
        container.find(".img-list").append(`<img src="${defaultImg}" id="id_${index}_img_${i - 1}" style="height: 250px; display: inline-block;padding:0 5px"/>`);
      }
      //console.log(container.html());
      let url = $(this).attr('href');
      url = 'https://' + location.host + '/' + url;
      container.find(".img-list").attr("data-href", url).attr('data-index', index);
      lazyLoad();
    });
  })

})();