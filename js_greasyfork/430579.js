// ==UserScript==
// @name             Auto redirect
// @description      手機版、電腦版網頁自動跳轉
// @namespace        7ED70DC0-CD34-11E7-8C84-6590899BC43F
// @match            https://m.gamer.com.tw/*
// @match            https://m.facebook.com/*
// @match            https://m.591.com.tw/v2/rent/*
// @match            https://m.cosdna.com/*
// @match            https://m.momoshop.com.tw/*
// @version          1.3.0
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/430579/Auto%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/430579/Auto%20redirect.meta.js
// ==/UserScript==


function toPC () {
  switch (location.hostname) {
    // 巴哈
    case 'm.gamer.com.tw':
      document.querySelector('.gtm-nav-backpc').click()
      break
      
    // FB
    case 'm.facebook.com':
      if (location.pathname === '/story.php') {
        location.href = 'https://www.facebook.com/' + location.search.match(/[?&]id=([^&]+)/)[1] + '/posts/' + location.search.match(/[?&]story_fbid=([^&]+)/)[1]
      } else {
        location.href = 'https://www' + location.href.slice(9)
      }
      break
      
    // 591
    case 'm.591.com.tw':
      location.href = 'https://rent.591.com.tw/rent-detail-' + location.pathname.split('/').pop().match(/\d+/)[0] + '.html'
      break
  
    // CosDNA
    case 'm.cosdna.com':
      location.host = 'cosdna.com'
      break
  
    // momo
    case 'm.momoshop.com.tw':
      switch (location.pathname) {
        case '/goods.momo':
          // https://m.momoshop.com.tw/goods.momo?i_code=7502072
          location.href = 'https://www.momoshop.com.tw/goods/GoodsDetail.jsp' + location.search
          break
          
        case '/search.momo':
        // https://m.momoshop.com.tw/search.momo?searchKeyword=防噪音耳塞&couponSeq=&cpName=&searchType=1&cateCode=-1&ent=k&_imgSH=fourCardStyle
        // 不能直接使用全部 location.search，會搜尋不到任何東西
        let searchKeyword = location.search.match(/[?&]searchKeyword=([^?&]+)/)[1]
        location.href = 'https://www.momoshop.com.tw/search/searchShop.jsp?keyword=' + searchKeyword
        break
      }
      break
  }
}

function toMobile () {

}

if (navigator.userAgentData.mobile) {
  toMobile()
} else {
  toPC()
}