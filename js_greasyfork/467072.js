// ==UserScript==
// @name        Arcaea 潜力值页面显示精准 Rating
// @namespace   Violentmonkey Scripts
// @match       https://arcaea.lowiro.com/zh/profile/potential
// @grant       none
// @version     1.0
// @author      Byaidu
// @description 在歌曲分数下方显示精准 Rating
// @license     GNU General Public License v3.0 or later
// @require     https://unpkg.com/axios@1.3.6/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/467072/Arcaea%20%E6%BD%9C%E5%8A%9B%E5%80%BC%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E7%B2%BE%E5%87%86%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/467072/Arcaea%20%E6%BD%9C%E5%8A%9B%E5%80%BC%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BA%E7%B2%BE%E5%87%86%20Rating.meta.js
// ==/UserScript==

setTimeout(()=>{
axios.get('https://webapi.lowiro.com/webapi/score/rating/me', { withCredentials: true })
      .then(function (response) {
          exp=document.getElementsByClassName('experince')
          score=response.data.value.best_rated_scores.concat(response.data.value.recent_rated_scores);
          for (var i=0;i<score.length;i++) {
              exp[i].firstChild.textContent+=score[i].rating
          }
})
},3000)