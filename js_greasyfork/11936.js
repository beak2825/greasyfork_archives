// ==UserScript==
// @name        TVShow Time - T411, CPasBien and Google search button
// @description Provide a "Search in , CPasBien or Google" button in the "show" and "to-watch" pages
// @namespace   https://greasyfork.org/fr/users/11667-aymeric-maitre
// @include     http*://www.tvshowtime.com/*
// @version     2.3
// @grant       none
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAFnUlEQVR4AdWZzWtkSxmHn7eq+nT6Y9Kd5I4zY5gPh1nMiOLi/h3CdaOg+AGCkosrN24UFa/gUhDNSjfCXQr3H7m48G50NcMwMzGf3Z10us+pqtcUOY195oTodJNEH6gEwjmHJ796q07xHuFiePz48TeAD4D3gduA5WoIwB7wKfAJ8DHUkTMh3uKHwNb6+vpX+v0+rVYLay0iwlWgqnjvGY/HDIdDDg4OPgO2gd9fJvqHbre79eDBA5rNJukBIQRUldm4CkSE2SiKgtevX3N8fJxkP6TEzUuura1tJfF08WQyIUmmUXKlojPS7N2/fz/Jbh0dHZFk5xP9Sbvd/s2zZ8/I8zyNlOYSYsuLJ+GXL1+mkvgZ8JHhnK0nT56kJG9ccjZzaSbv3r1Lcpsl+rWzKf/Lo0eP0nQn0bqkgCBchAJcYUns7e0xGAy+7YDvbmxszC+cyoUxRkbDHA2KSs0fMYLYJoL5971S/lAQAcRf+I+qghjotAwiimo92bPFnUS/44D30xZUWTglSTKGSLfdIQZQjVQRjBVcY4KxBiOmmrWAqlKEjBhB3jJREQygWgDCRTQaDYAvOWDNGJPqsxb7YDBhrdfmT7/7Aq31MZwIFawl5J7h67/S7XuanSaogsZSdMpkvEIo3sPKEDDM4zpwtAs/+KlhPO2w2hVUteYBrDpKLtonvYfglc3NIbQPYKNBFQNFoDM+pn0nQD+CloMAMoFRhGIP7A6QUaGn9I2SF7cJsctFlE7qgMjFIJyvvuOB0G03YGip0HAUI+VgP0eySEscRAX157ImZzzKkNigYdoorno7cHgcy+S4DDVchvDfEQvQKcQp6ATiBPQUwgQJBTOTZTAsTyl6ei4Y0++8rJscYqTkJkWlFA3gcwgF+ADBQ0yioRQVlsVxCaogInRvWcDCqq3d3pDibEyxWoCOQSnlFDRgYk6zI5ABkSqr0BsAKKpLiBojiIH9fU/HFTAsBRAA1Cnx1OO1xWTqYNwGIkQFFMiZ5F1ODgJWPKrVUnWnevZsBSxGlhDt9TJ8UfD17/+D08mYIvcoipQao7GwebvJxz/vstKfYuJKtSI6ip7At37seXPQp9uKUBFSjFiMbXOrtaCoqmKdJcbIzq4wmWT4aJjnaCQ0XJNub0LW/iecrlCJreEpjONgdJ/RZBWxea20rBHWVilfoYvWaDyXvXO3g8b6C2F4LHzuPYfJmoADzQBAOScKkYyNvsFm5iw1Sw0FZfbsBUUBBEGMgKEqAbhMcNYCAnL5sS2GSIzxalY91OXqaVwPDpZHBChHBQER/d8RRX05cup/B9UbF1VCKBiMVjD0GJ80maczDQyGBh88quGGRAViVIqiwBQGq02cZsxjNOKi4AtP4T2KIMj1JxpV8UVBQ/Zx9pCWq4o658lwTPN1vA+gDgyg1ygqCBqVECNRG4AjalZ7fAC8L8qtqbwPvebTk4Dqfz671l8WXLMoynVh+D/BAcKCqAoC3GordJSMSIVO5FYbkKWzl6VEjQFjDfsDWLcwPaFCcxrZP7JY28CpAUDRRRpo4oCjEEJnkf5Qryv4wvLNX32evOjjiwiliJYHb+cyxLbptwXk3cu63C1GDvh0PB5vZlmW7N9pdVojqG2we9Qjz7tEDQBzZ1Kh4Sy31wyZMyxC2Rj5zAF/Pjw8/Oq9e/d4dwTrDHc2BI22Nq2CgJTTJ4u9lUajEclx1h99+fTp080Us/d+Ad+r2cFCCDx//hzAOM7ZfvHixUcPHz6sdfRucjvd2dkB+OV8p+TXZ3W6nXrnsw8LN83u7m7q124Dv3h7w//wrGe+/erVq5TqjcmmxfPmzZtUm9vJ6bLPNz8Ctnq93hc7nQ7OuZTylX5siDGS5/nsE87fgST5W4C6aJ3vAR8AXwY2AMPVEIED4G/AJ8AfqcO/ADJL8y3oELgCAAAAAElFTkSuQmCC
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/11936/TVShow%20Time%20-%20T411%2C%20CPasBien%20and%20Google%20search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/11936/TVShow%20Time%20-%20T411%2C%20CPasBien%20and%20Google%20search%20button.meta.js
// ==/UserScript==

this.jQuery = jQuery.noConflict(true);
var search_base_link_t411 = 'http://www.t411.co/torrents/search/?search=';
var search_base_link_CPB = 'http://www.cpasbien.io/recherche/';
var search_base_link_GL = 'https://www.google.fr/search?q=';
var search_suffix = ' FRENCH';
var newNode1;
var newNode2;
var newNode3;

jQuery(document).ready(function() {
  jQuery("<style type='text/css'> .download-linkgoogle{display:inline;width:14px;height:14px;margin:0 auto;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABBxJREFUeNqMVFtoFFcY/s7c9pIm7rqxF8NGs7JNNEQibWzRij750DYBJVUhkry0qSCUVgqFQguhL6UUzIOFgvRB6GslbQWpELGiVpKSixqjhWza3dYkzWaz2exOZnZm5/SfmTWr7e6mB745Z+b855v/8v2HJRKJPV6P8hUTpZYvri3hu7sZZHQLzSEF7x8M4fXmZ7AmyMCVK8Dp04BM63KD01BVfTkQmEiEw++xpWRyZHMo1PHZcBKfXvwL8IqAQIYGh0cR8MM723E4WuMe7u8Hzp/HRiPR0DDMTCO/YkKq2/n5FGYXdDCZubs0cfJ8Z9iPX8+0wC/T3+JxmK2tQDZbkdT2SZflvwVRFApLqonl7Bp9ygOFIsw8mGhi+o80bs+uuqcaG8H37UOBlpVgEixaCuAUvcQgc4O+6iXix9A1jMUzJZfa2hwCi7HysH9As2RxjqBPQlNAxOKiBiji07GZJhZWtFKNirNC5560dL1lzmzbEDE9KJ9duzdj5O4jQFT+RWygTimxKrfGsVrjwUSjhJmIH2kpjzpTRuR3lW+Lr2nhVXgZZVGSRLdYpw5uwzfXYpj9MwNGERQV5PhyIBpwqz11E+d2TeD7ExJ+qzfAlTQVmWw4cegWf34Z1qEpqG9fRY7dmMmk9kdqg/bBkVgK3YM3kHhEOWW2LDh6D7+IC/17MZWeQtdPnYiZs3AT6UrH5eWujEQnR/BmlTgLD9xJfdkVDr7VHrC3kNMNXPg5hlhSxd4dIRx7pRFX54bRM3wS8+o8xciqatiOUmLKPPOeuZ3SNAQ7IjV4LVKLlnovOiJ12NPgcwwnU+PYP3SAfpjbkNQtAyenlTlJ4To0imT04RpGpxftXOHrd1vXie8t3UduJQf4XYH+r8HtRrG1a2qUUtKsQFpWDDRv8azbHGk6guOtxwGV7E2Oqt3xBETPS8c+0nO6D5ruSAt6HrJPwBu7n4NABZTpAjoaOerU5nriOjjpkzn9jooQLTErZdUcolsD6GxvQHvTFtTX+ihigZqbwfe4/5mAgVcH0BZqQ9/lPqiGCiawqqmQzp1sR9+hZvht6RozwOo4oCXBY2lYoh/CC29Szz/r2HdHu5GnNu/5sccpUjVlMHqkkLoVtGLfgmeJuKAXq2SHS7NvK4SWD8FCHesHOy924tKDS1SP8sQy5DnBSFyGNfYx+PI9IiUvGFkzSgLzUg5ICuoCrMlPaH9y/WDvrt4NiyeQp3Rz2G9EaNkXno1CCaAc5Vdh3R+k9zWHOBqMupquRsxz8ybnEjiRVAQFx9MPCdMOsWWnqFDMWBmQckQhn8ckK5hPe1kWZMOdCwJDD4bA7a6qIDfqvDtSRldOKcwYlATrZVQqBxWUBZrBgm0YnRvD2Ztn3Qvnv51obMKmXwgf/CPAAK1HHNEaQQ2zAAAAAElFTkSuQmCC') no-repeat 0 0} .download-linkcpb{display:inline;width:14px;height:14px;margin:0 auto;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAROSURBVEhLdVVNaBxlGH5mZ/9/sj9pkzYR09iWioJCBSEF0fQiPXmo+HProai3gCDqLQjiwYIFPVkUBRGLIurBgx5EChURDyIBJeBPU6NJJ242O7szOzs74/N8zqxrjR987Mz3vfO8z/u8P2stLy/H+J+li6EFBJaFkDviO1+R4c5HMfJxDJvPMX8t3qdrGASw9gNOAbt2Bid7Pk7v9XBnf4ByJGjgej6HbyolfFavYC9rY2rEc4JnMhkEgwEG/uC/wALdI+AdBFq9vo0jwRCDhHGckLIJIrZ6fb9Zx8XD0yjyOfJ9BASVg38xFuiubeOxnTae2dwxDoZJiALRlk2qnd6rZLudz+Lx+QPoDUMUE3vJNV4K/eGdXTz9mwOHzwPdkFlpNEI5HCHQO7WdCkNkKcuId52MhToBL1/bQpN3YYI2ZqwkzQQh3lnfMExjes7RUPzePtjE580aXIYoJouDAOe22ri318cez7Rmyfy1RgWX6lWUpbchxe1mbKxsOuiTwYhOMrzs8vmREwt4d6ZJZ7YxVqTrhTxWjs7jlQN1NAjYIIHXmchXG1WU+J2WAVauDw2HuIsMPH6o8rEZ6pPHboFPRhV+eJiJ6eZyDNVCQdq6PbxVyuOlVg3vVYu40KwaKdKiM8BK0N2uJzmpGyUYxfioNQUnlzXZ75Dt5atXzW6RwBadDlgtLdp/XCvjAm1bE6BjxiMC3+b5LCuyt2Jk4whfNGooGY0ZFlnfKBZx3HXxyZUreGFtDZ6dRcDzAh1Xk9KbLISxxiVl2SQ9NlK40jTRy5xNfHXWcbD29Ve4vd83HbnfMsC68tSyiRTSscykqDKkj01mcja5nj12HGuVCqPbfyIYYJt8rhUKZCiwCD7xljpdJs6CRVCPSS2zdrXemJvDiaVT+HR6mlJFnCN/k7oZ3gBnSfV7JoGwhrVHwDM3dk01dPsebPb/B7OzuP/kPXh54QjqdKK5oXI8xVnyUKfHBDOqiZASxsBGMY/1Elmre2ghJ6s//gKfXSeji7cuoEfdBarybBNIoM9vt/HUTofgLrvwH3B7cXFxVRrbBPupVMSDThsDMgmJ1iDomW4fmzkbDqeYWj6isZri3J8dnOfuEkxN9YDbN/c/FAvIKm/p2FRyeqzbR393cPYPx4SmNtMkqzBsta7LMyWrFUbGga/kcutMds/NHcQGMXIq0VQWDeoqB82b7PcP2Z5mxlKWIQ12kxCrBCzyzCXDfjL487STdCvzM/iZc1qg4wYxT2LAJqn4AS5NN/DioRZBWfyUQ5NMZTcyyeWA4S7wrEYi37Ktn1iYxTaZpnPCwBkpBNr3EbJdxVxbYYY8v48aL/U8HOVEk7aagpucGd8xH1+ykn4lyyqd6C9qclnLp5djjx+OmG21rpbKJh3q+r9Trartx/95NMgl/yIC3K/3Mh6zGamkki5LQRN1zCyoUVexbXE3uetkqJlrsn8T0/T1L0FzJBUnKOxtAAAAAElFTkSuQmCC') no-repeat 0 0} .download-linkt411{display:inline;width:14px;height:14px;margin:0 auto;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAA5pJREFUSEvtlf9P1HUcx58f9AeXX1LU1BbgKYSBNzyFaSKSx3EICuUhTqdziR7LwwSFmVtSaSobskss0QqFMyMWkTfygGWGiTCYeNOQk25Rmghn6N2lng6znr64H3T+Af7g5g+v7f3Z3p/H+/l6PZ+fzxsk8TTqqUAHhT4HP5oAxlX9hTRbH8ytbnx+zosD7V4cbPdEqaquEgYzYfyKyJLKPUZkS62v5vAtdVxQfvHkUusVNYrtwKcOoOwyYOkB8mqB7Go8Af7C7tVqjl0jShwsaviNmL2GGB1BjI8iJs4igl4nVPFEeCLxWjIROE32rCB2nyGqbxGV1ynghCfA0VYB7nUQu+xExm4ifS8xJpJ4aQbxcgw1i43c13iJIbpMYnoqoUmXyiBmCli3gRgWRLygIpRRxDqLxKKoAyi+SGyu5cb9VkKbTSwwEZmHiEnRxCtzGJqwit85+mlz3qTV+Q8Rs5zNf7p57tptNrruEyOm8gPrWR5s75V1GBH7joC3/ixzaaDhs3puKbMxSGck1KIo66i0HktM1bL+io/fODxs6rnDE5dvE3PfZn2ni8kFX7LI7uawiRp++G0Tq7s8xFg1laETBGysVBCayIEH/7Gx9by0PY+Y8gbxbg0RlkCVfg1PdLuJV1PY1nuHbT0+Qr+RGBlG7doCfu2Ug8bPoCIe2Lqlm0kxVBAo4GUlQxE0l79778k8pXVZ+0eQV0tELGJz3wC3VZ4i5q+jvc9Hx80BP2gQoM3awdO98izvKMFxbHPdJULiGRAgiv2fn5hT1uEiRolZskagJEEipTJs5sluD8/3/8tfbwyw7eotHrK7aCysIILnMcFUyEve/4lQHZXwJHa5Zd7hKVRelLQg1oRBhSqzjaW2swyJThPlEq/3f+SYRblscPazoqWLO2uaebTjb3+7QyZL5MJ0TNr0CW/cF3BkKhX1m+z1PSCilhIL3xPw9jNQCn7KRkgcU9Z/zMhEyW6wmPbRL7Ihl0jbKu3FiapEHnd6+IdPWpyeJiAD43PMrGu5QCVaIjd7NSfEifH6XI4zFErsDvch4Mh1HOm8B6wolhPfklpCmC8QyXliWpLMerFfkSJqFM0yKrOWS+RWSjrWSmUyQL2E89M30FTeTKwsJVaVTnkEtgjY0ulDecddQC9AfT6xs0lMkZSoJCWD7c8UYMYeIkcSk18nBv8gXtgakX98GnK+B0xVkjILBPz8t/n4mnv2bpCHWsaqaj/9eLQAAAAASUVORK5CYII=') no-repeat 0 0} </style>").appendTo("head");
  
  
  jQuery('li[id*="episode-item-"]').each(function () {
    try { 	
      if($("div.heading-info").length){
        var serie = jQuery("body").find("div.heading-info h1").text().replace("                              ","").replace("                          ","");
        var saison = this.parentNode.parentNode.id;
        saison = saison.replace("season","").replace("-content","");
        if(saison<10) saison='0' + saison;
        jQuery("body").find('div.row a.watched-btn').removeClass('col-6');
        jQuery("body").find('div.row a.subs-btn').removeClass('col-6');
        var episode = jQuery(this).find("a.col-1 span").text().replace("                ","").replace("              ","");
        if(episode<10) episode='0' + episode;
        saison = 'S'+ saison;
        episode = 'E'+ episode;
      } else {
        var saison = "";
        var serie = jQuery(this).find("div.episode-details a.secondary-link").text();
        var episode = jQuery(this).find("div.episode-details h2 a").text();
      }
      
      var recherche = serie + ' ' +saison + episode + search_suffix;
      
      recherchegl = recherche.replace(/ /g, '+');
      
      newNode1 = jQuery(this).find("a.subs-btn:first").clone()
      newNode1.attr('href', search_base_link_GL + recherchegl + ' torrent');
      newNode1.attr('target', '_blank');
      newNode1.attr('title', 'Search on Google');
      newNode1.removeClass().addClass('download-linkgoogle');
      newNode1.find('i').removeClass().html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
      
      newNode2 = jQuery(this).find("a.subs-btn:first").clone()
      newNode2.attr('href', search_base_link_t411 + recherchegl);
      newNode2.attr('target', '_blank');
      newNode2.attr('title', 'Search on T411');
      newNode2.removeClass().addClass('download-linkt411');
      newNode2.find('i').removeClass().html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
      
      recherchecpb = recherche.replace(/ /g, '-');
      
      newNode3 = jQuery(this).find("a.subs-btn:first").clone()
      newNode3.attr('href', search_base_link_CPB + recherchecpb + '.html');
      newNode3.attr('target', '_blank');
      newNode3.attr('title', 'Search on CPasBien');
      newNode3.removeClass().addClass('download-linkcpb');
      newNode3.find('i').removeClass().html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
      if($("div.heading-info").length){
        jQuery(this).find("a.subs-btn:first").after(newNode1);
        jQuery(this).find("a.subs-btn:first").after(newNode2);
        jQuery(this).find("a.subs-btn:first").after(newNode3);
      } else {
        jQuery(this).find("a.subs-btn:first").before(newNode1);
        jQuery(this).find("a.subs-btn:first").before(newNode2);
        jQuery(this).find("a.subs-btn:first").before(newNode3);
      }
      
    } catch(e) {
      console.error(e);
    }
  });
});
