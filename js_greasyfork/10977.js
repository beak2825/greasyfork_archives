// ==UserScript==
// @name           Ebay - Add links to similar and suggested items
// @description    Adds links to similar/suggested items pages for all item pages
// @author         James Skinner <spiralx@gmail.com> (http://github.com/spiralx)
// @namespace      http://spiralx.org/
// @version        1.2.1
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAABxSURBVDhPY8AB1IF4OxB/hmIQGyRGFFAB4ldAnAnEPFAMYoPEQHIEwTogzoEwUUA+EIPkCAKQk0G2ogMJIAbJYYD/FGKsgsTjp0YW/5ExQ8olFPx1PRMKbtshjoJHDRgUBmDEK+kYqyApGKsgkZjhPwD2u2Q5hCnUtQAAAABJRU5ErkJggg==
// @icon64         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAG6UlEQVRo3u2aa2xT5xnH/+diHx8njp00OMHOYne5rGUQkgDhmtKuZAyJaF1LOrb2AxPSuEgbFGiLNhXRbf3QiiEWrQvbGsZ60aAq2kpXsa2wZCSkpVAITZsuES4JxHbimPhuH/vc9uGcOE7sgDRt2rKd99PR+z7nPc/vub7n2IQsy5jLg8QcHxqABqABaAAagAagAWgAGoAGoAFoABrAf2rQ/8Q9x7tv/7YnCGDHQ0WPLyucewBDt/nOwRiA5lqTFkIawP9iEgsC1/tx6tN+ye+HIBAsS9/rZJY30NZ5ObeIJcX3Po1cuclNxASDjqwu0W9cXGCz6LMlxfBnor9LjrsgREDqCX0RYaqhSpp4yPHUhCJTYJhPkbrZ1A3EbyoXJqaEppgcANG3/xht+5Xo82W5imQ3rDfv3UVZLJnT7V0T+095/VFxmlXe8H5njeVQy/wCVt1fjAymerdL/s5snQidJerYesxzQpJTANbf/+ISx5ac2l/3nXvzyrcBmAy2HY0fqLdnfloMtb4cPf6aoi6zehVTWwO9XnR7uHMd4vg4AKrMPu/V9h//jXv+HR+Aink61zhPEmhakL/UaQRwZTj+Xn9MkGQAi+zM+WcqLHm0lPByHXVy0gcAbDltbyEMdkicONEjjZ2BLALoNJReI0QAFta5rbE7pxOOv7/BE7oyA3LKA4muC4r2ZIGpqPUwU7MovSR9f2fgBwe4zvPiiDv00mEs36nMu8Z5q4l653vOhi/mpYUvD8W//vMhT1Docye3v+4+sc0h3DiqaE9YlhjWdJC6/LQwP3IqdakFQEPS/5mxNCUlg4mhTzxvLS77Vrb5Fe1NBlvm6lQSR199XY3CPbsztQdAGgyWHx0g8/MBJP5yVvT7VfcROLm9PFN7AEudxlM7HCQBACcvhT4eSZDFa3V1x3R1x5j69kztAejKHiMKagAYZaG+oFaZvOA6Ikr8DIBu1yHl4oHKZ5Ton+YBMRZLXb0GgGD07Pp12e6j8vP1y5dx5zogSalLHwF1AFZVGB/8Uo5etqIib211XsdADMDp3nDNxq9MZnFSDPfLSZ/Mh5XIAUCQjBLEDbZNvbFBjg9kOyFtfgvrXGjblKMKCUPDkCQAsiD6Ht2cM4ekUFAVdntQUgdgZYVxtnLROAnQN8JBElO3XhOH2qXgh8gybXowlGnFvbs6Bw8qTlho25TOhLT5V1fsnpEeKoAcT0waSRS93rvUXkmaLHmzthEzqy5xKZ67+Jg4enrSlSyZXwVdIUEZQeoBiBMXkRxVFpeVb7k8/Mto0pvphKHbFxTzFxorZ5h/CoDMV+OYttuLjrbeWf+8jgQ64wBGw8JsMrcC6lJh/M+K9gSdR9e00WWPk9S0FpG48DXJpwLoaHZNxd4/9e/LdEL3ddX8ayqezq5OKgDtdBA0LQuC4PUSDEMXF9+pe5tGgTiAM30RUZIoksz20Jm+sGrUgsuq6R1b9Y4ns5wpyqFrmROLyzZfHPpFIP654gQzW34z0AOgyFj95fnNsx4lSJZlVq9UHh5p+3W2XGpg0L1kpbt+hWdFo5xQ4+2Gnz9y1p8t3NbpHxhNAchjyEcWJNOFIMe2w7+Rk2PTqgWpa6zcny5HXddfUs1fuY8kqTudhUw7txF6PYD4798OvvhTMRROL3FXeyf2PgtZBsA2b4wQUzGw/62x5/7gDSfUgIly4gvvju0+oWbRTx4psTrWqsk1/Irg78mwPZ/6/Cjftztbp4W25pKCxQCCiaFbgQ8AWE2LFtqac4bDtE4c7zwf/OEBOcEBIPQ6uqqSYFnJOyq4PYqAvr72ntbDe04Hfnb2NoAnllve7YsE46JBR9w33wDg716O49UNn2oqPtRiI6VEvPshOfCh2jks9SRbJosJOXhVTo0TjJUoflByvwlA33BKZ//GZIvsPPnRN9OKPVp7/L7SDTkBqIMHD061FafDsL5JikQlj1dOcNK4X/R4pUgEAF1dZfru1sKn9xAM03M9Hk6IpWb6qaZ7nmu2BhNivyd1a4IfDQmCBAANTvblJ2y71s0jCIDUUfbNkCU50gcpCc4rRwfkmAuQqS88ySz7HUGxcsxFGEpJ6zrKVK1oUpTndI3/NZL0Kub/6oLnAeLuHsg8kPIjbnHcL8fjpNlMOx2UxXyHtOZ48RN30hfmTQaqwqrPeRSFxIuhPjnpkwmSZKyU6X5kNNQZI5EKtnU1cHwIQEv9G1XWdbNJEv+dvxN3DLzw/o1WADZz/ZaVZ+bYC02EG7t8s32y9u+be29k3a4jvBgDYDcvrbQ+/K//KvFvHRwfDsRd5YWrADxQ9exd5QntvxIagAagAWgAGoAGoAFoABqABqABaAAawP8pwD8AMGz36P6ZROQAAAAASUVORK5CYII=
// @match          *://www.ebay.tld/itm/*
// @grant          GM_addStyle
// @grant          GM_getResourceURL
// @resource       icon_similar data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAw1JREFUeNqUkm1ollUYx3/3fe77edmz2m7Xi8s1UXS5WCIYFKTysFFCRIz11dBMcFN50iAjcnO2fSnJSGgaFCgEBa4gjLmZlmkQkn0oYYhvj6lbU+denmey+37ul9N1bxZSfel/OFyHc67rf67//xzj4/vnjAeuVxkGIWFkkM3NxXcDdBhhKBM7ZXFi7wjK1ChLYaWSExIdDIMYVuCVKjdd+wFcH7TNqfbVrOw6gDYUhg74sX0dW/NyjpynE/TUZivNTFrq7xIoHcJQHg4fgMjCvePjT9yg+HUbTvNe/EIB9r0FRgTNGzDCAFOmoc0ZAuM9p0ZXjF/Hm72DV77M4jyxkNOXavgpX4MbKsnS4Lmkj/YzceIXkZGQBmYJrO2r9jCw5jGmA43n2ziLNvPpd49TNW8ZW1ubpJi/0b+sniPPDbG4SrbNuwRohVu9lIMDvpDYNFiP4FQ30PxCE139w6i4Acskk7bJNTYSun1cvHxll7LsnTMSki/t0V5hvugXAdLu/hfPs3Zjjt0nC6x7+kEmvJBrUwHnx0rYpsGGJYoPez4hkUwasZFW3QOvs2Xn5wRBiRIRhb4kqVSKqaDAZClkeDrktvgXldncnNYkU2nJFSOVNSPDil/DeXiSg4Pv4xseTXobUSmIlXG9GDIaaaYTisqMqE2E+F6JIBLG0ERLkiVmFrs7Wu/TsdEyzbkuo+NjPFRmcva2j5LoZJIkMja18uS3RscoBYoW5zNQSaxfe1glXqi/nB55rbj+6Lffb3p59bN8ccUXGfJppPV5kctKe5JvjhyjYWkD3tVebcQCludmayMZXqgZ/Ijqt3d0nl24oLYqu+IZysvLiLsrFu9w/OQpRm6Ns7FtC1bhNPnDnfKM/8AHu/f/se2N1sbWts25S5fzr0axXoEWreUVc3h0QR2FwUPU1VdwQfNvghhd3e/+1r7jzQ5Z7rt3v2/XijNl3lPU3ezl96nsV2C3/CdBjM53uoclDM/cLt8xwOb5ju1P9nZmzhzS9ZjmjZaBn4fWGvx/LL9nfe5PAQYAZxs6DhKOvuQAAAAASUVORK5CYII=
// @resource       icon_recommend data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDhBRUMxN0U3NkI3MTFFMkFFOEY5NDlBOUFFOTZDQjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDhBRUMxN0Y3NkI3MTFFMkFFOEY5NDlBOUFFOTZDQjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0OEFFQzE3Qzc2QjcxMUUyQUU4Rjk0OUE5QUU5NkNCNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0OEFFQzE3RDc2QjcxMUUyQUU4Rjk0OUE5QUU5NkNCNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqQt0TAAAALESURBVHjanFJrSFNhGH7OZdNN59TpVkgXXWamU9MCqcChSSlYIkHhn6CowB/dJAjM6CJlKFRIEEVY/chKYS6l/lgmotUUohRCzbAluraxNi9zZ2fnfJ2ZZouo6IH3e9/v9nzv97wvhQVUGmP0FIsebZxC5+MIXC7ui4wWt9R1ukfxB9CLAS/AvCknTpeVlYSU1CTIFFE6j4c34S9gF4MwBZUml0eAkceCldOg4IB3ZtbwzwR+LgDr+BT0ETIkZyTDpdBDlafDRZomRAxIJygwLFtz6mRl9W+ZDm6UE+IzEXGkgVy9VkdaTG3kV7S2tpKaS5dtP99jFgNDrJBSWpZvePLyKxhVMvbs3oWKm89Qfb8XtzreYcDqwPHyIjjttkhDZjbb+byjM0TEvkDieUvfGF4NBVBWsh1H7vaiQBK0paocNYfK4A+PxYl7vdhZvAM87z8dUoXtDWNNWy+8ee/VGsHNcQhXKjDkEpGlX4EPnjlMiiIS09dgWFpjw5UQAvySiMbat/a9G5TxualqrHRzMPM8iJ+DOlqDIYcXwQ/T0QpoowCVWiPVm5MyEJb6YJmKic9IUKJpwAdPQgmUYQxsdjuyEzXotvpgmxEgCCImJjlkrtbA5nDMV+QHgdvjw6iTkzpvClc63DDm5aG9vR0H0gBttArOmSgMDrOI8NPYn07B9PgpItQxuNH4MG3+Cw73DD67eHgkIhfxoVFcB53VAqrlAcoKC6FapZp/yT09i+bmF7BOOFF75jD6rxcNBlOhtPvMZFvuWmiiIyGVWlpiIFAyyMe7EGl/DYh+iIQGL/VcgApDqYFHnsYM5N+B5XYVWO/H7mNtXm+9IHzvShIcKFryDAi1WTKK5z/1HCWWektwy3iuoF8gc2C6KsCL2nk11JLpQ5QJRZBzRLLphXnOo7PF/YRQWL/c00Xh/5Cz4N3fBBgAJ4IpvJlfMQcAAAAASUVORK5CYII=
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10977/Ebay%20-%20Add%20links%20to%20similar%20and%20suggested%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/10977/Ebay%20-%20Add%20links%20to%20similar%20and%20suggested%20items.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, laxbreak: true */
/* global jQuery, MutationSummary */

/**

==== 1.2.1 (13.07.2018) ====
* Update linting options and globals
* Update jQuery to v3 hosted on unpkg.com

*/

(function($) {
  'use strict';

  function social_icon(href, title, icon) {
    return $(`<a rel="nofollow" title="${title}" href="${href}" class="sw_talk spx-icon">`)
      .css('background', `url(${GM_getResourceURL(icon)})`)
  }

  // --------------------------------------------------------------------

  var m = location.pathname.match(/\/(\d+)$/),
      item_id = m ? m[1] : $('[data-itemid]').data('itemid')

  // console.info('item_id:', item_id);

  if (item_id) {
    let $beforeElem = $('#RightSummaryPanel td:first, #RightSummaryPanel .share').last()
    
    let $links = $('<div class="spx-icons"></div>')
      // .prepend(social_icon(`/rcm/?itm=${item_id}`, 'Suggested items', 'icon_recommend'))
      .prepend(social_icon(`/rcm/v1/?itm=${item_id}`, 'View suggested items', 'icon_recommend'))
      .prepend(social_icon(`/itm/like/${item_id}`, 'View similar items', 'icon_similar'))
      .insertBefore($beforeElem)
    
    if ($beforeElem.is('td')) {
      $links
        .append('<span class="watchPipe">|</span>')
        .wrap('<td>')
    }

    GM_addStyle(`
      .spx-icons {
        display: inline-block;
        vertical-align: middle;
        height: 25px;
      }

      .spx-icon {
        display: inline-block;
        float: left;
        margin: 1px 3px;
        width: 16px;
        height: 16px;
        text-decoration: none;
      }
    `)
  }

})(jQuery)

jQuery.noConflict()