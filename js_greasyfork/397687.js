// ==UserScript==
// @name        Virtonomica: Unit 2020
// @namespace   Virtonomica
// @description пытаемся исправить новый дизайн подразделенией
// @include     https://virtonomica.ru/vera/main/unit/view/*
// @include     https://virtonomica.ru/vera/main/unit/view/*/investigation
// @include     https://virtonomica.ru/vera/main/unit/view/*artefact-modal
// @include     https://sbs.simformer.ru/fast/main/unit/view/*?old
// @include     https://sbs.simformer.ru/fast/main/unit/view/*
// @version     0.30
// @grant       none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/397687/Virtonomica%3A%20Unit%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/397687/Virtonomica%3A%20Unit%202020.meta.js
// ==/UserScript==
var run = function() {

    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
  
    var api_token = "https://virtonomica.ru/api/vera/main/token";
    var api_view = "https://virtonomica.ru/api/vera/main/unit/view";
    //var api_view = "https://virtonomica.ru/api/vera/main/unit/summary";
    var api_list_artefact = "https://virtonomica.ru/api/vera/main/unit/artefact/attached";
    var api_artefact_attache = "https://virtonomica.ru/api/vera/main/unit/artefact/attach";
    var api_artefact_remove = "https://virtonomica.ru/api/vera/main/unit/artefact/remove";

    var api_research_stop = "https://virtonomica.ru/api/vera/main/unit/project/stop";

    var api_finance_report = "https://virtonomica.ru/api/vera/main/unit/report/finance/balance";

    var api_city_info = "https://virtonomica.ru/api/vera/main/geo/city/info";

    var api_unit_info = "https://virtonomica.ru/api/vera/main/unit/info";

    var api_unit_bonus = "https://virtonomica.ru/api/vera/main/unit/project/bonus";

    var api_test = "https://virtonomica.ru/api/vera/main/unit/data";

		if (location.href.indexOf("fast") > 0 ) {
    	console.log("-------------fast------------");  
      api_token = "https://sbs.simformer.ru/api/fast/main/token";
      api_view = "https://sbs.simformer.ru/api/fast/main/unit/view";
      api_list_artefact = "https://sbs.simformer.ru/api/fast/main/unit/artefact/attached";
      api_artefact_attache = "https://sbs.simformer.ru/api/fast/main/unit/artefact/attach";
      api_artefact_remove = "https://sbs.simformer.ru/api/fast/main/unit/artefact/remove";

      api_research_stop = "https://sbs.simformer.ru/api/fast/main/unit/project/stop";

      api_finance_report = "https://sbs.simformer.ru/api/fast/main/unit/report/finance/balance";

      api_city_info = "https://sbs.simformer.ru/api/fast/main/geo/city/info";

      api_unit_info = "https://sbs.simformer.ru/api/fast/main/unit/info";

      api_unit_bonus = "https://sbs.simformer.ru/api/fast/main/unit/project/bonus";

      api_test = "https://sbs.simformer.ru/api/fast/main/unit/data";
    }

    async function fetchWithCache(url, cacheTimeInSeconds) {
       const currentTime = Date.now();
       const cachedData = JSON.parse(localStorage.getItem(url));
       if (cachedData && (currentTime - cachedData.timestamp < cacheTimeInSeconds * 1000)) {
           return cachedData.data;
       } else {
           const response = await fetch(url);
           const data = await response.json();
           localStorage.setItem(url, JSON.stringify({
               timestamp: currentTime,
               data: data
           }));
           return data;
       }
    }
    /*
    // Использование:
   fetchWithCache('https://example.com/api', 60) // Установка времени жизни кеша в 60 секунд
      .then(data => console.log(data))
      .catch(error => console.error(error));
    */
  
  
    /** Добавление в очередь на пересчет */
    var KO_API_ADD_QE = "https://test.pbliga.com/virta/konkurs.php?&action=add_qe";

    // картинки
    // https://icons8.ru/icons/set/%D1%81%D0%B0%D0%BC%D0%BE%D0%B2%D1%8B%D0%B2%D0%BE%D0%B7
    var img_service_src = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAEYElEQVRoge2ZTWwVVRTHf8X2IaHFgEZqoASlhoRKWhalVsTEhAISd9YYwqbuUIkJCxPCwgVJXYH9CjEhQHRjggtNTKFJy0cA0YTYalJEIShKETQRKp9t4eljcc515k1n7sy8N6/vSfpPbt70no855557zzlzC9P4/6AO6ADOALd1nNG5uiLaFRkpoAdIA5mAkQa6lbckkQIGEGPHgE5gJTBbRxPQBYwrzwAl6kwPYuAlYLmFrx4YUd7uKbArFuqQLTOG3QmDeiQyaWBZAe2KjQ5khTtiyHSrzIcJ2XCU4HOZAU5GUfKDMjfGeHGTygzHkLHB5oQZobiljJUxXlypMjdjyNhgM9bqyAwPY1wY+VxkE4XbkRH9jXNwDe+lZMyJBN/z4nakX383xVBqePutXIXBi0EEk37HkdQahgZggmTTb9QzEnrwTTodwe5MA3BZeTvjWBqCxBypwGlRxhHHnkeyUyXQjFT/CZwWpSI/2ykDvic43YaNwNqSUgdsTeN9JBL5OgFyTofycORE2AvqkIo9jNSYW/q8ixJrSYqJFPATuUfBmn6nGvkW0Sz5MuBtYDWwAHgSWAh8DawNUTQAvATcAUaBP5F+bRD4DLiep6GxcQ//0NVaZGoDZMy4CiwOkO0Pkc15mzUDbyCVshY4oMQ2iyNtyvM5MA9YArwMvAWcVtoRJOJeXC2AI3/7GblZifssjuxTnnd9aPOAK0p/x4f+qdK+RbZxrqhBtnEGWfxJeE6J5y1KzivPigD6q0q/zeQtWgP8QXLR+IuABZkBXFOmah96NU44H7E4ux+nYHmz41PAHiRB5OrADSQS1qh+qcytPrRWpfXZFACPIe19BtjqQ18EXFD6d8ATHvpMYA1SlH91OTAKtIS8+z+8p0JdPrQupW2PoKcF+Be4Cyx1zT8NXFQ9p4G5LtpC4GNkxb2ZcCeyNSOjWYUHfWjmgK2OqOsj5f8G2YrP4kTqFBI5g2fI3m5DQDvwAjkW7xRS6NLAHNf8HJxvlkcj6qoEflHDdgO/6/Mxsu8H5gI/Km2ABPu5Y6p0nWtuPc4BjoNVwD84K+11ogI4rLRhsqOUN3ao4nbXXLvOfWCRW4c47EWnyvaSHc0y4BOljSCtUqJYq8qPu+aO69wrFrk7yOq/7pkvR7qHcs/8+6rzJvLlmTiqkA+oMSQVztTnNPbQm+0zRnhC2IhktTSwIU97rTAZahWymiaT2ODtgYLukRuR6GWALUkYa4O5D96mI6i2uGGc+EJ/LyKV3I3FOGl2Sm7zX9OXHdSRYfLe98I4MgupE6YeVSm9CslMRq+tzUkM85E9PKojqP9ywzgC8DjOJ+0Rle3Vv8+SXaMKjnMu42wdsYHbEZBt9BvZZ+c6UuGnFHtdBti+UQy8joD0Vn3ITcxXFCjNhuFNHOPaIvD7OVIScH+fL4nAXxRHvFXWDxeAQ4hxPxfWnNJCUSJSzAu6RPFQOXKS5G40ipatChWRSP8Pn8bDjAcHevCZnSJLQwAAAABJRU5ErkJggg=="/';
    // https://icons8.ru/icons/set/%D1%80%D0%B0%D0%B1%D0%BE%D1%87%D0%B8%D0%B5
    var img_worker_src = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAGYklEQVR4nO2aa4hVVRTHf+PMODqpWYmOhhrlq6msSSgyJ7VE0pQpQzQsSxTFpCLSMsQiMguK0hJq1B5kmpVWUvZh6ItNhdR8kEoKM80KLFPLLEfHx+3Df23vuXfu45xzzx0HPH843H3O3ms/1t57PS/EiBEjRowYMWLEODtRUuT+ewIPAucDzcAqYHuRx2xXeBdIeJ6dIfqoAxqBJqABuDKy2RURvYE5wD40cYB6xIRHgMEB+joA/Gn9/IeY0G7RF3gVaEGLbQE+t7rlwEl7EsBmoCZLP6XA7cBH1rbevjcBR4F1wKjIZ18gJgEHgSPAc8Ag4Aqg2uqrgJH2Ox+djhZ0IryyqBrYihb+D/AvsNTqGozuqNV/DPQq1oKCYAba2a3AxT5pupOUEctJMuFatPAFQFfEsDKr6wKcC/QwmlPAL8DAgldQAG5Ci28AOqfVrbQH4F7g67T6EuBFxISHPN+7e8o9SGVAF0/dVKRddqXRtBm6Ab8BO9BupWOiPQBXAXMztCkBPkHH+rIM9b8Ci628Cfgwrf5OxMDXgkw8Kjxqg48qsJ8+SMK/k6GuFl0DkHyoztBmIzqFgwqcRyCUoN3/LEeb+faATsLKHG2dlugTYi5D0UYsCUrYIcRgDjXAhUglZYMzgPxgnc1nnM/2ZUg+AHyDNmO0T9pIMBstbmhE/ZUigfayz/aPIfkAMMHmcgyYFtF88uIJG3SyvdeQWcjlgldIXg38jXS7H1QBI6xcCcwEvgNOkN3AigxjgEOIAe5ezwW+CtiPV03ORTLgOFKZYXCRzWlpnnanEcYbrAD2IKuvDvgxRB/ZcB6wFhgLDEHOUyVwaYA+mhBT50Q4rxRcjrh8X5H6v976n27vw0j1KP089fhEWf4mrVBhv5MRM6KGk+yd7HcPuXezHrnLIJthDvB9EeZ1GmF2JMwz2+d8EkgF7sS/yo0Ezr+/g2ATTodj6BIkxZtyN2cj8DuSERjtXoLZHKdRiCHkkMsQCoJFZPYF0jEcucAD7H0UcI2V3wg6aBgZkA4X4Tnu+XY/clVXZGhfh3Z9KXKAQM5QA3J68u3iaOT+brb3ccAlVo5qM3zhYTRZt2tOpQ4keRwHZKBz9sOUNLpyFAfI5BBlQwfPWI0kBXSb4Dob+Em0o056lwGvI/c00wlbhKy9nvZeafTTrL95AeZQZTQLAs49EnQEfiC41E6HV6scAvoFoJ1qdLUhxy4Y3ZHeTaD4fxiMNPpnCbb4UqQxdln5jKEEOExmgecHMxEDggQzSoBlRndXyHEjxafAT4RTq+8Df9BaXvRH1yP9+1CkAbyO2BmHi8tNydcwDdXIfX0+Q50ztI4BXwCPI8fLyYtVFD+15xvlwDa0k3190lSiO3yQZMzPC8eAN4G/rLwbWGPlFch7bDeoQXp8J/ktul7AFuT/Zzs1jgFViFlD0HW4heQpaEHZowlEY9UWjFo0sWbgBVp7i/2AhSjXlwAeyNHXjWiB29EVq0UW5j5gPxJ+a5AATgA/oyh1pvB8myKBjuwpK+9ASY8tJHfuoP0Oy9PXeOTpeb3EbaRmiLsh42m71e9DjDpjqtEFJAYic9kt4DDwDHJcXEA1HwNA2aabgXuAG8i9sDrkUSZQuL5/mAWEQScUJ3ya1hGZcuQsVXq+OQasBW4j2rRWKbpmLeg0RBW1boUK4FZgPcrqeI/pe3loF6a1P4G8wRlkZ0ZVlnK23GEtylTvAs7Ju5oAGAy8gkLYCRtkAzALCbn16P7PI7OeHoNS3t+ixMoU5DgdsP6OoqDHCA/NeOuzyp5T9g1y5w6nW5+zQq41BYOt85M2gQbgbiSEvKgkKfAaUbh7IrrDG4x2N63thY7W7m2S+f8vka9QSXLBWNldqVy5wwrr56VgS01FOXJhm5FVtpr8YeqOaFf2k3rUj6DMzwV56KtQwMRpk9WEN3oCRYnT0RXZ+U6qBonPg+7mMGS8DCdVEPpBT+AtCg+wZmVAPlv6A6RaFqMdadOoqweTECM6I+OnOSB9o9EHwmi04GVBCYsEJ9DCxh0C4ykbsLe9e/P71UjiOrWziaTwWUky4Znt/wFh6N3/EVwwNBLkigq7GN/eLPWJLGXve64rE5Q+gfIBbfavMOeNtSc0kT9xEgh+8gKhVUgR0B/lCiODHwaEjfYWC5EyIEaMGDFixIhx9uJ/dP7JMX/xV6kAAAAASUVORK5CYII="/';
    // https://icons8.ru/icon/set/guarantee-warranty/carbon-copy
    var img_top1_src ='src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAADsklEQVRYhe3YW4hVVRgH8N+cccbByQs2TpN5iegydLGMyoeiqCzNLhL6EBUlGIUQUaIjXSCIniTIMKVHXwqyy0MW2EV6kWwqQ8TCqAetl8zKCopKyh6+73DOHM/M7N2cIYL5w2avvc5a//Xf3/ouax8mMIH/Fu0t4LgOD+IsfIUurMId+AOHx0JeGaO4uzCAN1PY23l1YQc24J4xrlEaU3BlCvsY3SOM7cYnWJ9zppRdrK3k+IuwDbtxEC9iEpbhFJzIC34RVmzH3ehPkffiQFmhRfEWzs12BauFv01vMrZHuMBUNV/vT9Hjhn1578Kj6CswpyfHTm7gaDluxSvZHhCWKYppuD3br+GWFuoC9+N99OImXPAvec7Gacl1X2ukMQMfoiOfHyoxtwdrhe/Vz+1Izma+OwRF8uAskWyPYw4OFRTXLSz/PJZk37a8H8c3OLUg14how17xtstSZBUz8QjOb5gzCY+LvLdWbGs9ZiTnqGmuiAVP4AMsFNY8WvfbYhE416pFdFuKfgF3iipzpO63ebgUe9Ry5pixG7Ox3FBrdApLdYpU0oU1OBMrcEUDz2yRDc5IzpZgHt7Idr+wVj1m4WFRSTbhElyPG5twLcY52d5hqLs0RZEt/lOthh50coo5ivdwWwqtiOh9pwlXP77M9pTkHrPAb0Xt3CKqwY84vWHMgRQ6gIvxchOeOfghObZgP74rsH4htAkfe05E6GPKnSXbc04Fm5Or7EFlVFTEWxOBskEEx2iYnGNn5fN+Yz+HDot31dLJdKzDVSOMv1rkwWn53JcchVHWzDfgKZHjvsAgLsPl+Estr1XyGsSnWITz8ACeLCNyUkmBe8WWzRQR24mV4mTdDBW8jt/xkciTe8ssWPajabXwoU14VUTsEmGpRXhCJOKfcQxPi0hdI7b3EC5MseOCPSLHVVHBs+JkcgzX5HVMlMf1akZYgQXJMS5YiO1N+leJqrG1rm+rqBr1mCxq8/bkajk2Y2lDX6cIkpfyXkW1rxFTxYF3c6vFdYlviUafXSz8cLDJnEERTPVYIGr5vuQcFUWDZKXwq10N/d+LGvxZE5HdTg6II9n3qzistuzzc6f4a6NPROncXGC5kwOnih5DA2Juzu1Lrp2tEteL38S27MRGEaEdhg+cKqoB0ZFzNibHvuTsHW3xIpWkIs6Eh9UqxTpR6maIj/nhrLEUN+MnkRufqVt3Pr7G3wU0lEZF+OPnRvbj9hyzyzgeEIbDfOGDo2F5jp3ABP6X+AfikauHP2er8QAAAABJRU5ErkJggg=="/';
    // <img src="https://img.icons8.com/wired/64/000000/physics.png"/>
    var img_technology_src = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAEfUlEQVRYhc2ZXWxURRTHf9BWK7gUE3mASiwxKqUoL7pVA0+KRoVEHwQjxIARjEYhNQaCiSngG1GDmhA09kF4MlE0JCR+PWkEt2KM2taULzVN4UEDLYV+ALY+nP/0Tu+de3cN264nmezunDNn/jPnY87MQnloDtAG/K32AXBjmXRfNd0E/AGMxdopoL5ysIyqgXYiUJeBK97vAlBVMXTAZgH5B9gBzASuB14HRsV7qVLgaoEzAvFKgL9VvNOSnXJaKwDfAdMD/OnAYcmsmUJc4/QpZto7MmSWSObAZACoBW5Qi9NMYBD4vAQ9XwAXNSZOTn+qC1THfueALcBq4BYi010GOrCoLEjpdcDeEgDuBR4ENgJ9QB64B2gCaiQzCpwAPgJ2ARdCiuqALpL5bBA4CwwFeG8BizPALZZMfFyfdA4EeB3CkqAdntBZLIXMDyyiGegBuomiuB0LmmvU1gI/iHdGsj3Yzs2O6ZwLtAi0m397COBXnsADKTsC5hZDwDrMBe4D3tMEp9X6MNPeK5n1GhN3KZ8e8uYf920/PQzpcwT4OkPRbZhTFzDfaQeOYubqUxsAfsR20cnUArdm6P0S83WA4ZDANm8FWWfoSuASthvLMfN1Y7muSm2N178cC4ZLwIoMvfO9+bemCYxI4OkMRS8AvcA+4BzwHOHztkq8c5LtBZ7P0LtOc4+Q9P1xekdCnSmTgvnWGPAZME99NcCTwNtqq4lSyDzJjpGelqqIMsjujEUwi6h0ejbGywH7xWvz+hdoQaF00eDJtal/n3T5tFG83wO8BOWxRHkeWKi+JuA4liq+BXaqvyYFnGu/Eu3kTo3tAY4Bi9TfiAXVBeDuYuAcPYpFVCdmrn7gJyx49mMBBWbWNHCurZLsNo2tl65+8To11yOlgnP0DFFNd4ho6z/GkjiYvxUD6Hxqs8YiXYfEH9VcQQqVSf8rSgO4AjsdujATLwW+wcwzBMyQ3JES5jiszxkaWy9dS6X7N81VsombsfKoH7hdfYswxw4FSQfp5v2Z6Hjzg6QbCw70eR4LknwxcHXAn1K+PsbLYSkinmYasGgNgWvw5Fya+RC7t/i0gRLTzLsS/IX/nqhXYQGxG3iCaOfKlqj9oy7rDjHZR90wdtdOkF8szM1QNBXFwpaQwEFvBdMyFDVKzp0E1ZgP9WBm6tL3DURmbtKYRtJpmhbh3AeYmGbcxeVa4OEMRce1iLzGNwN3Yc49Wy2nPieT15hjGXrvJzoWg5cov+QfAF7FilN/hfXAMpIlf4Fkye+eRPySfxlJ97kZeJmJJX9rCGAd2Qf/cKDvTcx8adRE+NI0SBSQoQIjeGkCy0/bMT/yH4FGsBJ+DxZtLep/LAOco8cl26Kxe6TLB3gF25xWwvfnILmLe2g15bq4z6LIxf1qyD193JkhswSrVj6ZDADFqJTHoyOSeWoKcY2T//z2WoDfKl4vlroqQpuIHH0XFmQ54A2v/8VKgQM71gpMjEY/+r+nwk/AYMn7FMl8dpKo2qk4zcH+evhL7X3K9DfEv4kEq3QGXCYBAAAAAElFTkSuQmCC"/';
    // <img src="https://img.icons8.com/dotty/80/000000/office-worker-in-a-suit-female.png"/>
    var img_customers_src = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAADSklEQVRYhe3XS2heRRTA8V9M0qCmtSqIDywudGdadKEV4wNNjU0jWFJRdCHFhTsXIhYFwdYuKigigm5EcCG4qULwBT7wQbFRoVXBB4qPVmkVF6HG4qMSF2e+9H6Xufd+XxLFxfeH4XJnzpxz7pw5Z+bSo0ePJTOJD/AbPsaWjMzpeBqHcQhPYXWNrrn03LQczn2La3ESrkzvmwsyg3gfj+Gs1B7HG+ir0HUyxvAdJpbi4Ie4ptR3PtYX3ifwTmbue7i8QdcYZpbi4BEMZ/oH8CyO4nc8kpF5FPc16FqZ+is5ocHBL3Bppv9mnIMLMIRLSuN9ad7+Bl3r8XmDD7VsEvtkg9g3V+Aq3I538Saew0di352d2hPYg/4KXcO4Dt9j41IcJPbYjMi8fclAP7bhNhHu0/AMfsGPIotPqdH1K/Yuh3P/a+7AlziG+UL7U4SvxSTeFis8jZ34SWTxTQW5PWluUdexZOMu7SWpkYdFCC7DitLYoAgp3IMDuBVr8Dx24zyRSN+IvSnNGSzpWpFszCSbHbEWB+VPgiKj+AFnFvrWYaTwvgpfy58+RVYnmyPlgVyZGcMrmG1Q+gDuFcdbi82YKrwfwd0ihHXMJptjnTi4SpynROhynIuLRDibeCvJVtGycUgm85sK9XxF/414CSfiqwqZkdTm5E+jJhsdOViVWZPJwSnte3Ax1GbvQMPk3NcNiyNqC14UK9Ti565cq7axQJODua/bIErQSlwtrlAtnuzGsxobCyxmBW8Q4b0FnzQZ6IBl34PjeFlk37Q4V+sYEidINzYWyDn4h+OnR+7rjmI7ThW3mLmMDHyKM/BCalW0bAwl223kQvwaXsXfFcbHRUF+EBfXOAh34jPcXyOzBg9ha9LdRm4F9+F6EZZdpbG14gIwIGrgcIODc8nBv8SK5tglVm5c/JS1UZUk+1PbUeqfEv8VfSIksx042CrSF9bI7awaaMriHK87flMeFqu6TZylRSbS2GFLoCmLm5gWNbG8FaS+vUlm0TTVsPmSzHaRPP3puaNCLteXk6nrx+JWcFT7/+6/Srd7cLdIDupr23/GQZ2tVlluVPwKNOnKyXXFxqSg+KOTu76X5Q6IWtqkKyfXo0ePbvgHcILEgulYOQ0AAAAASUVORK5CYII="/';
    // <img src="https://img.icons8.com/color/40/000000/circled-pause.png"/>
    var img_pause_src ='src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAADTUlEQVRYhe2YS0hUURjH/9+91wobbTIfUUGODyKwXWYLBQkXVouCsfYpISkVLWrttnYGGoGPvU8IKgJrY0HSslo0zjhjYC1MbZyhdObe+7Vwcu57fMydCem3+87jnt89h/ME/rPHod1Urnm8VKxKUpMKqgPoJIBDqawowPMC+JMgy9PBO0dWcybY3MNSpCLeRiraQbgAQMxQRQbwmhnDkTLPGK6T4pqgry/WBsJDAFXbqfcXBkIC48Fcd9HEVutsSfDEQLSkICkMgXFlJ2KmRhmTMikdX7u8KxnLZipQ3RetUUl4hR32mgNBUVRag53ekFMhR8GU3DSAo1lVS/NdFJUmJ0lbwRMD0ZKChPAB2e85I0Fel+sj9w7/tMoU7GoVJIUhuC8HADW0Xxqwy7QU9PXHrmVrQmwRf2X/6lWrDNMQN/ewNF8e/wKH3rtULaG2JP1vMwsK3n/TL2/nj4loOJ5eImeXVbwIyU6Ss+FSz2njOikZS0Uq4m3EzkN7uVrCxep01V4kTIINx0XcPbtvM34ZkjMJ1vqW4v4wMKJNNA0xqWh3+oqrMN8wJukEq54uH0ptX3mCWk4NLhZpU/Q9qIiNyLy3uom0tl7YqE3QCxKdyamOBQKUOn2shelkTm2sIKrUhjpBZujGPy8wF2tD253kX0EnSIRYvkQ0ErrTt05QBUdyKmOFSmFtqBMUBPFjbm3MMPBJG+sFE2tvsXGHyBfJ/Qd+v9Mm6ARTt683OVXSQOCpLx1lunlgmsXMGMqdkqFt0LAxzXyaKfOM+X7EgwBq7D70PCQjsKJuxjML5pvkzIKCXiQ249ll1VTGQCBc6jHd9iyP/FVPYn5mjGX6YnbhK+Gu4mfGVMuFeu5W0TgxJt2X2mTUSg5w2ElkUjoABF1TShMgMXnTLtNW8GuXd0UUlVYA313R2uCbqiitc50lUbsCjntxsNMbEkWlCe70ZEBVlMb5296wU6GMh4VgpzfE63I9gPGsqQGjJCbPZZIDtvl4VNm/epVAjwDU7lAsAPB9uwlhxfbfB0dY9C3F/RsXHGqBxVpqIEngKQYNh0s9E64+vxk5NbhYtLZe2ChAqQNRJdTUA6aAKJgjzMLHg/j19nN3eXw37fxnT/MHnokTuIw2uwoAAAAASUVORK5CYII="/';
    // <img src="https://img.icons8.com/wired/40/000000/duration-finance.png"/>
    var img_finance_src = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAABmJLR0QA/wD/AP+gvaeTAAAFE0lEQVRYhe3YaahVVRQH8J+vHqn1egmVYFavoonSikoLooHmwUaQBskXOdSH5nkArQ9BEw2KYIMY2kRFlGGFNtFApRkNNFgvbUCzV9bTtCzNPqx9veeee+59l1dmQX/Y3H3O2mfv/1l7rf/a5/I/KrDlhiZQC33wBtbi9XT9r8IpWIaD0u8pjT7Ya30xStgbJ+BwtGEHLEjtRczAe/UmaGpgkcPwFb7EoQ0S2xQP4h2ciK/xcLI9jG9wEuZhWhpfiEY8OAfzU39nDOlm/EZ4Tnjs9ESyf47ECizB/olwB47Dmgb4rMN+uBhL0Z7aUlyUbLUwCj9he+H9z0Vy5NtnYkfa0IVzGiW2NZ4Xb/M+ZuGo1Gbhg2R7DlsVPP86bsbAtPBduEJlklyBu5N9G9yKVxsh1xvvisAdVGfc4DRmHjbJ2ZaJxBgjvNdLeH9Bsi9I173E1o4WcdpVtFA+ScZgOxyL3fGF6q35ArumMW3pmSxa8DMGiORYW+Ml1+I1jBWx+mMjBE/FZOHJaZgqsveh1BbiAUwXnrtHtaatSrYutNYgV8L1Ill2wshGCA4Ubh+K73GjeNNZqcENWCRiconI0Cw6RHi8nH5Pq0Pwaxyf1nulaMDGBYTXoBmr60z8ECak/i0522M4H5NwDR7Bb/guM+YmjMDTuBe/1FmrAnNwtdCn1ThEOajblQOdkJDDCuZoFXE6Q8Tj9iLGzkj2M0Tc3YbFQmN3qUUov8Uv4GwhJRPENrVl7G1C454RXnmpYM4uHCMSaT4uTKRbREK1pDEThfB/KiRr81oks+iPTpEEm4qMPlxk5AAcIRLpceHhsXXm6oMLROx+JWJ5Zfpdht9xeRrXgXFFkxSVuqF4SnjoKZEQf2Ts3+JRUTHuEFWlbsHHmbhTJOE3okKtEvG5n0i4s9XX3gq04jI8Kbbjh9S6RLC/KRJpNqYUPL+HqBAltKsWakLoL8HRaiRKPga3ENJyKe4XGteJa1PrTIsPFgnytOq6fDs+TES6O/eVtHKV0N4q5GVmcmbBXUX2bZQmkPqdQv8GiFhqyc0xRnjoQBGjT9YhuLGI5SaVYbQOeQ8OEh64WiRE/gVKk7aKt98kQ76En4WWPo8DFB8oiEPJYOHtgSK2uyX4GfYVcrMGM9EvY++HZ0UCvZwIfJyb4yUMFzr4Cd4SSZLFmen+R0KyhiuWrCqcLFx+gBDPKaqPW/cn24Fp7Im5OfYREjISfXFdIjE92acn8tcKiWlP4/dqhCBxGFguNKzoM3FLIb7LxWGiCOcl8hOxp8j4LJpFOE3SvZ5WoUnE4FLlI1Z7aqXrH3CV+t80R4rjfumZrMyU7s0VhaBHaBZBvDhDcHG6V5Q8tbCNkK6F6Xphuh7QU2J5zBRvOlfEUk8wVCTdfel3/4xtN1G7e4xtRVxOTf2eYrQQ9lG5++ME6XP/wtzrFePFCWm1ApLZWOqPYRr7mP87sa/4UJsuKhkhZagkOFpo1qJ/jFoZTyiTqiJZwngNqvl6xgOiUvWl0oOlCtKxAUg9gStFDJ4lhHsllQfWDRWDw7CZcgyOVbC9WeyYGkG6dMptUf7jqBkHZ57JVoODlUvbEOXj2CDlT9TsGuPVyeIi3Jca8WE9O/VHiL8yiP9YSp+l24qyVdLI1ckujR+R+rPTfPk16upgUclakeuXrlfW6P8qgvrXzDMra/RXZPolPIq3xTGuITQrb1GTyqN4n7/Q760c39k1/tv4E4ReU/x2Ug33AAAAAElFTkSuQmCC"/';
    // <img src="https://img.icons8.com/material/48/000000/mark-as-favorite--v1.png"/>
    var img_mark = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAB9klEQVRoge2ZwStEQRzHPyuhOArJyQEpB+ugHJwUDopyxkVxcnH2Hzg7+xOWHCRuSpSDi6sDu6soFxyk5zC/baeXduft+703xXxq2nbfd37f+U6782b2QSAQcKEIHAFVIMq4VcWrqDn4jxwGHm8fWiGOPAy+1koaAZ49BnhuNriCQ4CohT5pSOTXluFAciEE8E0I4JsQoAl90jIj6wDbwFbGHk2J3x1d6QAqmLtpVw5+6gXXrT5rOfipF7yx+tzm4KdacFa0b9S34rNZ+KXdzHUDQ0A/MAgMyOs8MAEsAnPALnAHnAJlzKGljPl9PALvjn4t0WhGdoDvXzQRcCWawQaab6nh6qceAGAZM4MR8AKsAuNAp6XZBA6BC+BLtO/SN6mfegCAaeoHnyvMVylOO3BA/aAyncIvEa4Fh4F70TzErvUAZ3LtXrRp/ZxJUnBBNHfyvgsz871W/wVFP/WtxJS8XgIrmNneB14xq46tyY0kM3IsmkqszwXmZhaJRsvPCdeCBcwqVNN9AnvSPq3PX2i8tnsLMGppzoEx69owcGJdH1Hwc8a14AbwROON2xJmhVpX8HPGteAMZrlsRo9o0/oB4Y8t/4QAvgkBfPMvAsQfMvx2stJsNlWNANcOmqxQ8fb5kG9SI0AtRIn8HrOWNAcfCPxlfgD26qE3hL9k7QAAAABJRU5ErkJggg=="/';

    var div_ankor = '#unit-info';
    // проверка на новый интерфейс
    var test = $("div[class='unit-summary mmr']");
    console.table('main1', test);
    if (test.length == 0) {
        // проверка на чужой юнит
        test = $("div#unit-info div.unit-construction");
      console.table('main2', test);
    }
    //console.log("--- test");
    if ( test.length == 0 ) {
      
        // проверим, а вдруг это старый нвовй интерфейс
        //console.log("short_finance_report");
        test = $("table.short_finance_report");
        //console.log("--- test 222");
        if ( test.length > 0 ) {
            div_ankor = "div.unit_box-container";
            //console.log("--- test 333");
        } else {
            div_ankor = "table.infoblock";
            // console.log("--- test 444");
            test = $("div#page");
            if ( test.length >  0 ) {
                div_ankor = "div#page";
                // console.log("--- test 555");
            } else {
                // Это для нового старого интерфейса заводов и т.п.
                test = $("div.unit_box-container");
                if ( test.length >  0 ) {
                    div_ankor = "div.unit_box-container";
                    // console.log("--- test 666");
                }
            }
        }
        //return;
    }

    // проверить страницу, для ненужных страниц не рабоатать
    if ( check_url('finans_report') ) return;
    if ( check_url('virtasement') ) return;
    if ( check_url('consume') ) return;
    if ( check_url('supply') ) return;


    // убираем мигание
    var red = $("i[class='fa fa-circle ']");
    //console.info( red );
    red.css('animation-play-state', 'paused');

    // убираем фланг страны
    var item = $("div.portlet-body");
    var el = $("li[class='list-group-item']", item.eq(0) ).eq(1);
    el.hide();
    console.info( el );

    // свой блок ифнормацции
    var div = $("<div style='float: right;' id='r_info'></div>"
        + "<div class=u2020_grid>"
        + "<div id=u2020_main class=flex-container>"
        + "<div class='flex-item portlet mt-compact light bordered mt-element-ribbon' id=ext_div>"
        + "<div class=unit_header>UserScipts</div>"
        + "</div>"
        + "</div>"
        + "<div id=u2020_ico></div>"
        + "<div id=u2020_text></div>"
        + "</div>");
    //$("div.row").next().before( div );
    $( div_ankor ).before( div );

    var unit_id = /(\d+)/.exec(location.href)[0];

    // свои стили
    var st = $("style");
    st.append(".unit_ok{color: gray;font-weight: bold;}");
    st.append(".unit_small{color:red;font-weight: bold;}");
    st.append(".unit_big{color:green;font-weight: bold;}");
    st.append(".unit_curr{color:blue;font-weight: bold;}");
    st.append("#rs_stop, #step1to2{cursor:pointer;opacity:0.5;width:32px;}");
    st.append("#rs_stop:hover, #step1to2:hover{opacity:1.0;}");
    st.append("#rs_stop img{width:20px;}");
    st.append("#step2begin, #step1start, #step1to2, #img_superconductor, #img_agitator, #img_buh {padding: 2px;cursor:pointer;}");
    st.append(".unit_header{background-color: #337ab7;color: #fff;padding-top: 2px;padding-bottom: 2px;max-width: 80px;text-align: center;}");
    st.append(".unit_ico{width:20px;height: 20px;margin-right: 4px;cursor:pointer}");
    st.append(".fin_table{margin-bottom: 4px;}");
    st.append(".fin_table td{padding-left: 8px;}");
    st.append(".fin_table tr td:nth-child(2), .fin_table tr td:nth-child(3){text-align: right;}");
    st.append(".fin_table th:nth-child(2), .fin_table th:nth-child(3){padding-left: 6px;}");
    st.append("#r_info{background-color: #e0ebf9;padding: 8px;display:none}");
    st.append("#virta_mark {margin-left:12px;}");
    st.append(".u2020_grid {display: grid; grid-template-areas:\n" +
        "            \"u2020_info u2020_ico\"\n" +
        "            \"u2020_info u2020_text\"\n}");
    st.append("#u2020_text {grid-area:u2020_text;}");
    st.append("#u2020_ico {grid-area:u2020_ico;}");
    st.append("#u2020_main {grid-area:u2020_info;}");
    st.append(".hide {display:none;}");
    st.append("#hepotesis {display:flex;flex-direction: column;}");
    st.append(".hep_row {display:flex;}");
    st.append(".hep_row div:nth-child(1) {min-width: 50px;text-align: right;padding-right: 4px;}");
    st.append(".hep_row div:nth-child(2) {min-width: 110px;text-align: right;padding-right: 4px;}");
    st.append(".my_hep {text-align: right;min-width: 60px;color: maroon;}");
    // отключаем показ варнинга про смену гипотезы
    st.append("#unit-project-hipotesis > div.alert-warning{background-color: lavenderblush; border: solid 2px; display: none}");
    // скрываем лишнею информацию о гипотезах
    //st.append(".col-sm-12:nth-child(1) > .vir-list-group-strypes{border: solid 2px}");
    //st.append(".col-sm-12:nth-child(1) > .vir-list-group-strypes > li.list-group-item {display:none}");
    //st.append(".col-sm-12:nth-child(1) > .vir-list-group-strypes > li.list-group-item:nth-child(1) {display:block}");
    //st.append(".col-sm-12:nth-child(1) > .vir-list-group-strypes > li.list-group-item:nth-child(5) {display:block}");
    // сжимаем информацию о бонусах
    //st.append(".col-sm-12:nth-child(2) > .vir-list-group-strypes{border: solid 2px}");


    // поле для передаяи токена
    $("#ext_div").append("<span id=my_token style='display:none;'></span>");
    $("#ext_div").append("<span id=my_kind style='display:none;'></span>");

    // запрос токена
    // TODO сохрнаить в локальном хранилище/закешировать
    $.get( api_token, function( token ) {

        console.info( token );
        $("#my_token").text( token );

        $.post( api_test, {id:unit_id}).done( function( data ) {
            console.log('---api_test---');
            console.info(data);
        });


        $.post( api_view, {id:unit_id}).done( function( data ) {
            console.info( data );
            $("#my_kind").text( data.unit_class_kind );

            $("#ext_div").append("<div>Тип подразделения: " + data.unit_class_kind +"</div>");

            // показ приыбли, налогов...
            switch ( data.unit_class_kind ) {
                //case 'office':
                case 'medicine':
                case 'educational':
                case 'restaurant':
                case 'shop': {
                    $.post( api_city_info, {id:data.city_id}).done( function( data ) {
                        //console.log('---api_city_info---');
                        //console.info(data);
                        var my_kind = $("#my_kind").text();
                        var str = '';
                        for( var prop in data.retails ){
                            //console.info( prop );
                            //console.info( data.retails[prop] );
                            str+= '<li';
                            if ( ( my_kind == 'medicine' &&  data.retails[prop] == 'Аптека')
                                || ( my_kind == 'educational' &&  data.retails[prop] == 'Детские товары')
                                || ( my_kind == 'restaurant' &&  ( data.retails[prop] == 'Бакалея' ||  data.retails[prop] == 'Продукты питания') )
                            ){
                                str+= " class=unit_big";
                            }
                            str+= ">";
                            str+= data.retails[prop] + " ";
                        }
                        if ( str == '' ) return;
                        $("#r_info").html( 'Поддержка в городе:<ul>' + str + '</ul>').show();
                    });
                }
                case 'it':
                case 'service_light':
                case 'repair':

                {
                    $("#ext_div").append('<div style="display: flex;align-items: center;"><img class=unit_ico title="Финансы" ' + img_finance_src + '> <span id=fin_report></span></div>');

                    $.post( api_finance_report, {id:unit_id}).done( function( data ) {
                        console.log("---finance_report---");
                        console.info( data );

                        // current_turn_revenue
                        // дененжный поток -- prev_turn_income -- current_turn_income
                        // налог -- prev_turn_profits_tax -- current_turn_profits_tax
                        var str = "<table class=fin_table>"
                            + "<tr><td>ден.поток:</td><td>" + get_finance_val( data.current_turn_income ) + "</td><td>" + get_finance_val( data.prev_turn_income ) +"</td></tr>"
                            + "<tr><td>налоги:</td><td>" + get_finance_val( data.current_turn_profits_tax ) + "</td><td>" + get_finance_val( data.prev_turn_profits_tax ) +"</td></tr>"
                            + "</table>";
                        $("#fin_report").html( str );
                    });
                }
            }

            switch ( data.unit_class_kind ) {
                case 'shop': {
                    var serv = get_service( data );
                    if ( serv == '') break;

                    if ( data.unicity != undefined ) {
                        if ( data.unicity != 1 ) {
                            serv+= ", <span class=unit_small>уникальность(?): " + data.unicity + '</span>';
                        }

                    }

                    //https://img.icons8.com/ios/72/restaurant-pickup.png
                    $("#ext_div").append('<div><img class=unit_ico title="Уровень сервиса" ' + img_service_src + '> ' + serv + '</div>');
                    break;
                }
                case 'educational':
                case 'restaurant':
                case 'repair':
                case 'medicine':
                case 'service_light':{
                    var serv = '<table class=fin_table>';//<th></th><th>Город</th><th>Район</th>';
                    serv += "<tr><td>Уникальность</td><td title='Город'>" + (Math.round( data.city_unique_index *1000)/1000 ) + "</td><td title='Район'>" + (Math.round( data.district_unique_index *1000)/1000 ) + "</td>";
                    serv += "<tr><td>Сервис</td><td title='Город'>" + (Math.round( data.city_service_index *1000)/1000 ) + "</td><td title='Район'>" + (Math.round( data.district_service_index *1000)/1000 ) + "</td>";
                    serv+= "</table>";
                    $("#u2020_ico").append("<div id='virta_mark'><img class=unit_ico title=\"Поставить подраздление в очередь на пересчет\" " + img_mark + "></div>");
                    //serv+= "<div id='virta_mark'><img class=unit_ico title=\"Поставить подраздление в очередь на пересчет\" " + img_mark + "></div>";
                    $("#ext_div").append('<div style="display: flex;align-items: center;"><img class=unit_ico title="Уровень сервиса и ункальность" ' + img_service_src + '> ' + serv + '</div>');
                    break;
                }
            }
            if ( data.unit_class_kind == 'it' ) {
                serv = "<div id='virta_mark' style='float: right'><img class=unit_ico title=\"Поставить подраздление в очередь на пересчет\" " + img_mark + "></div>";
                $("#ext_div").append( serv );
            }

            $("#virta_mark").click(function () {
                $("#virta_mark").html('запрос на сервер: {id=' + data.id + ', company=' + data.company_id + '}');

                $.post(KO_API_ADD_QE, { 'id': data.id,'company': data.company_id },
                    function(data) {
                        $("#virta_mark").html('Server return:' + data);
                    });
            });

            // отображаем Топ-1, для тех, кому надо
            switch ( data.unit_class_kind ) {
                case 'it':
                case 'office':
                case 'educational':
                case 'service_light':
                case 'repair':
                case 'medicine':
                case 'restaurant':
                case 'lab': {
                    var emp_count = calcPersonalTop1( data.competence_value, data.employee_level, data.unit_class_kind );
                    var maxq = calcQualTop1( data.competence_value, data.employee_count, data.unit_class_kind );
                    console.log("emp_count = " + emp_count + ", maxq = " + maxq );
                    var emp_proc = 100 * Math.sqrt( data.employee_count / emp_count );
                    var st = 'unit_ok';
                    if ( emp_proc >= 90 ) {
                        st = 'unit_curr';
                        if ( emp_proc >= 100 ) {
                            st = 'unit_big';
                            if ( emp_proc >= 120 ) {
                                st = 'unit_small';
                            }
                        }
                    }
                    var maxq_120 = calcQualTop1_up( maxq );
                    var st_q = 'unit_curr';
                    if ( maxq_120 > data.employee_level ) {
                        st_q = 'unit_small';
                    }
                    var str = ", предельная квал.(120%)=<span class=" + st_q +">" + (Math.floor( maxq_120 * 100) /100)+ "</span>";

                    if ( data.unit_class_kind == 'lab' && data.employee_count == 1000 ) {
                        // для Лабораторий нет смысла отображть бболее 1000 ученых

                    } else {
                        str+= " предельное число рабочх: " + numberWithSpaces( Math.floor( emp_count * 1.2 * 1.2 ) );
                    };

                    $("#ext_div").append('<div><img class=unit_ico title="Топ-1, квалификация работников"' + img_top1_src
                        + '> <span class=' + st + ">" + (Math.floor(emp_proc * 10) /10) + "%</span>" + str +"</div>");
                }
            }

            if ( data.technology_level != undefined ) {
                // Отображаемся предельную технологию.
                var current_techn = data.technology_level;
                switch ( data.unit_class_kind ){
                    case 'lab':{
                        current_techn = data.project.level_developing;
                        if ( current_techn == undefined ) current_techn = 0;
                    }
                    case 'workshop':
                    case 'mill':
                    case 'farm':
                    case 'orchard':
                    case 'animalfarm':
                    case 'fishingbase':
                    case 'power':
                    case 'mine':
                    case 'sawmill':
                        var max_techn_100 = calcTechMax( data.competence_value );
                        var max_techn_120 = calcTechMax( data.competence_value * 1.2 );
                        $("#ext_div")
                            .append('<div><img class=unit_ico ' + img_technology_src +' title="Технология"> '
                                + get_techn_color(current_techn, max_techn_100, max_techn_120 ) + get_research( data ) + '</div>');
                }

                $("#rs_stop").click(function(){
                    console.log("rs_stop = " + unit_id );

                    // project_id=1769046&id=6576159&token=5e68c56d7eef1&method=POST&base_url=%2Fapi%2F

                    $.post( api_research_stop, {id:unit_id, project_id: data.project.id, token: token}).done( function( data ) {
                        console.info(data);
                        if ( data == 1 ) {
                            $("#rs_stop").hide().parent().append('<span class=unit_big>Вроде бы остановили изучение</span>');
                            return;
                        }
                        $("#rs_stop").hide().parent().append('<span class=unit_small>что-то пошло не так</span>');
                    });
                });

            }

            switch ( data.unit_class_kind ){
                case 'repair':
                case 'medicine':
                case 'restaurant':
                case 'educational':
                case 'service_light':
                {
                    add_service( data );
                    break;
                }
            }
            switch ( data.unit_class_kind ) {
                case 'villa' : {
                    process_villa( data );
                    break;
                }
                case 'shop': {
                    process_shop( data );
                    break;
                }
            }

            // Персонал, Топ-3
            switch ( data.unit_class_kind ){
                // для складов это не актуально
                case 'villa':
                case 'warehouse':{
                    break;
                }
                default :{
                    var all_top = calcPersonalTop3( data.competence_value, data.unit_class_kind);
                    var all_nb = calcPersonalTop3( data.competence_value_wo_bonus, data.unit_class_kind);
                    var proc_top = 100 * data.all_staff / all_top;
                    var st = get_top_color( proc_top );
                    var str_top_nb = "";
                    if ( data.competence_value != data.competence_value_wo_bonus ) {
                        var proc_nb = 100 * data.all_staff / all_nb;
                        var st_nb = get_top_nb_color( proc_nb );
                        str_top_nb = ", без бонусов: <span class=" + st_nb + ">" + (Math.round(10*proc_nb)/10) +"%</span>"
                    }
                    var all_top80 = Math.round(all_top * 0.8);
                    var str_add = "";
                    if ( all_top80 > data.all_staff ) {
                        str_add = " (+" + numberWithSpaces( all_top80 - data.all_staff ) + ")";
                    }
                    $("#ext_div").append('<div><img class=unit_ico ' + img_worker_src + ' title="Рабочие, топ-3"> '
                        + " <span class=" + st + ">" + (Math.round(10*proc_top)/10) +"%</span>"
                        + " ("+ numberWithSpaces(data.all_staff) + " из " + numberWithSpaces( all_top ) + ')'
                        + str_top_nb + ", 80% = " + numberWithSpaces( all_top80 ) + str_add + "</div>");
                }
            }
            // unit_class_kind - shop repair
            // unicity - уникальность
            // all_staff - всего рабочих
            // bound_level ???
            // competence_value квала
            // competence_value_wo_bonus
            // exclusive_market_price ???

            //customers
            //customers_count
        });
    });

    function process_shop( data )
    {
        $("#u2020_ico").append('<div id="shop_art">' + 'process_villa(' + data.size + ')' + '</div>');
        $("#ext_div").append('<input type=hidden id=shop_size value="' + data.size + '"/>');

        unit_id = /(\d+)/.exec(location.href)[0];
        var size = data.zize;

        $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
            console.log('process_shop');
            console.info(data);

            var size = parseInt( $("#villa_size").val() );

            // 300137 - 300821 : Система бухгалтерского учета
            if ( data[300137].length != 0 ) {
                $("#shop_art").html('');
                return;
            }

            $("#shop_art").html('наверное надо ставить бухучет');

            $("#shop_art").html( "<img id=img_buh class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/pub/artefact/vera//20213973.gif>");

            $("#img_buh").click( function () {
                var token = $("#my_token").text();
                $.post( api_artefact_attache, {id:unit_id, token:token, artefact_id:300821}).done( function( data ) {
                    console.log("attached = " + unit_id );
                    if ( data == 0 ) {
                        $("#shop_art").html("вроде бы поставили").addClass('unit_big');
                    } else {
                        $("#shop_art").html("наверное, что-то пошло не так").addClass('unit_small');
                    }
                });
            });

        });

    }

    function process_villa( data )
    {
        //$("#ext_div")
        $("#u2020_ico")
            .append('<div id="villa_art">' + 'process_villa(' + data.size + ')' + '</div>');
        $("#ext_div").append('<input type=hidden id=villa_size value="' + data.size + '"/>');

        unit_id = /(\d+)/.exec(location.href)[0];
        var size = data.zize;

        $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
            console.log('process_villa');
            console.info(data);

            var size = parseInt( $("#villa_size").val() );
            console.log( "size=" + size + "|" );
            // размер - ИД полит.агитации
            villa_art = new Object();
            // сарай
            villa_art[1] = 368595;
            //палатка
            villa_art[2] = 368596;
            // квартира
            villa_art[3] = 368597;
            // дом
            villa_art[4] = 368598;
            // вилла
            villa_art[5] = 368599;
            // ???? - уточнить бы
            villa_art[6] = 368600;
            // дворец
            villa_art[7] = 368601;
            console.info(villa_art);
            //console.info( villa_art[ size ] );
            // 368592 - политическая агитация
            // сарай\
            //key = 's' + size;
            //console.log('key=' + key);
            $("#villa_art").append( '...' + villa_art[ size ] + '...' );

            if ( data[368592].artefact_id == villa_art[ size ] ) {
                // уже запущена
                console.log('agit is run');
                $("#villa_art").html(' Aгитация запущена');
                return;
            }

            console.log(' add politics ');
            //$("#villa_art").append('---NO ' + size);

            $("#villa_art").html( "<img id=img_agitator class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/agitation_1.gif>");
            $("#img_agitator").click(function(){
                var token = $("#my_token").text();

                console.info(unit_id);
                console.info(token);
                console.info(size);
                console.info(villa_art[ size ]);
                //console.info();

                $.post( api_artefact_attache, {id:unit_id, token:token, artefact_id:villa_art[ size ]}).done( function( data ) {
                    console.log("attached = " + unit_id );
                    if ( data == 0 ) {
                        $("#villa_art").html("вроде бы поставили").addClass('unit_big');
                    } else {
                        $("#villa_art").html("наверное, что-то пошло не так").addClass('unit_small');
                    }
                });

            });
        });
    }

    function add_service( data )
    {
        var proc = 0;

        var sales = data.sales;
        var sales_max = 0 ;
        switch ( data.unit_class_kind )
        {
            //case 'restaurant':{
            //sales_max = data.customers_count;
            //break;
            // customers_max ???
            //}
            default :{
                sales_max = data.customers;
            }
        }

        if ( sales_max > 0 ) {
            proc = 100 * sales / sales_max;
        }
        var st = get_color( data.unit_class_kind, proc);
        console.log("-----12-------" + sales + ", " + sales_max);

        var max_costomers = get_max_customers( data );
        var str = '';
        if ( max_costomers > 0 ) {
            str = " (max: " + numberWithSpaces(max_costomers) + ")" ;
        }

        $("#ext_div").append('<div><img class=unit_ico ' + img_customers_src + ' title="Посетители"> '
            + numberWithSpaces(sales) + " из " + numberWithSpaces(sales_max) + ", <span class=" + st + ">" + Math.round(proc) + "%</span>" + str +"</div>");
        //$("#ext_div").append("<div>Потенциальные посетители: " + data.customers +"</div>");

    }

    function get_finance_val( val )
    {
        var sign = '';
        if ( val < 0 ) sign = '-';

        var dat = Math.abs( val );

        if ( dat < 1000000){
            val_fix = dat;
            return sign + numberWithSpaces( Math.round( val_fix) ) ;
        }
        if ( dat < 1000000000){
            val_fix = dat / 1000000;
            return sign + numberWithSpaces( Math.round( 1000 * val_fix ) / 1000)  + " млн." ;
        }

        val_fix = dat / 1000000000;
        return sign + numberWithSpaces(  Math.round( 1000 * val_fix) / 1000 ) + " млрд." ;


        //return numberWithSpaces( Math.round( val) ) + '?' ;
    }
    /**
     * Пытаемся найти значением с максимальной теоретичекой посещаемостью
     * (если такого есть в объекте)
     *
     * @param data
     */
    function get_max_customers( data )
    {
        // service_light
        if ( data.sales_max != undefined ) return data.sales_max;

        return 0;
    }

    /**
     * Получаем из объекта значения сервиса в цфирах
     * @param data
     * @returns {*}
     */
    function get_service( data )
    {
        if ( data.service_type != undefined ) return ( Math.floor( data.service_type * 1000) / 1000);

        return '';
    }

    function get_top_nb_color( proc )
    {
        if ( proc >= 80 ) return 'unit_big';

        return 'unit_small'
    }
    function get_top_color( proc )
    {
        var st = 'unit_ok';
        if ( proc < 75 ) return st;

        if ( proc > 105 ) return 'unit_small';

        return 'unit_big';
    }

    function get_color (type, proc)
    {
        var st = 'unit_ok';
        var setings = {
            'repair' : {
                'min' : {'val' : 50, 'style' : 'unit_small'} ,
                'max' : {'val' : 95, 'style' : 'unit_big'}
            },
            'medicine' : {
                'min' : {'val' : 20, 'style' : 'unit_small'} ,
                'max' : {'val' : 70, 'style' : 'unit_big'}
            },
            'restaurant' : {
                'min' : {'val' : 50, 'style' : 'unit_small'} ,
                'max' : {'val' : 95, 'style' : 'unit_big'}
            },
            'educational' : {
                'min' : {'val' : 50, 'style' : 'unit_small'} ,
                'max' : {'val' : 95, 'style' : 'unit_big'}
            },
            // Фитнесы
            'service_light' : {
                'min' : {'val' : 20, 'style' : 'unit_small'} ,
                'max' : {'val' : 70, 'style' : 'unit_big'}
            }

            // service_light
        };

        // medicine

        if ( setings[type] == undefined ) return st;

        if ( setings[type]['min']['val'] >= proc ) return setings[type]['min']['style'];
        if ( setings[type]['max']['val'] <= proc ) return setings[type]['max']['style'];

        return st;
    }

    /**
     * Сформировать цвептную строку с максимальной технологией
     *
     * @param current утсановленная технология
     * @param limit ограничение по квале
     */
    function get_techn_color( current, limit_100, limit_120 )
    {
        var st = 'unit_ok';
        var st_100 = 'unit_ok';
        var st_120 = 'unit_ok';
        if ( current > Math.floor(limit_120) ){
            st = 'unit_small';
        } else if ( current > Math.floor(limit_100) ){
            st = 'unit_big';
        }

        if ( limit_100 > current ){
            st_100 = 'unit_small';
        } else if ( current > limit_100 && current < limit_120 ) {
            st_100 = 'unit_big';
        }

        if ( current > limit_120 ) {
            st_120 = 'unit_small';
        } else if ( current > limit_100 && current < limit_120 ) {
            st_100 = 'unit_big';
        }

        var str = "<span class='" + st + "'>" + current + "</span>";
        str+= " (100%=<span class='"+ st_100+ "'>" + limit_100 + "</span>";
        str+= ", 120%=<span class='"+ st_100+ "'>" + limit_120 + "</span>";
        str+= ")";
        //str+= "</span>";
        return str;
    }

    function get_research( data )
    {
        if ( data.unit_class_kind != 'lab' ) return '';

        if ( data.project == false ) return '';

        var str = " ";

        console.log("get_research...." + data.project.current_step_time_left );
        console.info( data );

        if (
            data.project.current_step_min_time == data.project.current_step_time_left ||
            data.project.current_step_time_left == 0
        ) {
            //if ( 0 == data.project.current_step_time_left ) {

            if (
                data.project.current_step == 2 ||
                ( data.project.current_step == 1 && data.project.current_step_time_left == 0 )
            ) {
                $("#u2020_ico").append( '<span class=unit_curr id="rs_stop"><img class=unit_ico title="Остановить изучение" ' + img_pause_src + '></span>');
                //str +=  ' <span class=unit_curr id="rs_stop"><img class=unit_ico title="Остановить изучение" ' + img_pause_src + '></span>';
            }

            //str+=' <span class=unit_big>next</span>';
        }

        // работа с гипотезами и бонусами к исследованиям
        /** Превышение числа ученых на требованиями */
        var powered = '';
        if (
            data.project.current_step == 2 ||
            data.project.current_step == 3 ||
            ( data.project.current_step == 1 && data.project.current_step_time_left == 0 )
        ) {
            // employee_count
            // project.min_employees_required
            // коэффициент от числа рабочих
            var k_employee = data.employee_count / data.project.min_employees_required;
            var power_class = '';
            if ( k_employee < 1 ) {
                power_class = 'unit_small';
            } else if ( k_employee > 1 ) {
                power_class = 'unit_big';
            }
            powered = 'Ученых: <span' ;
            if ( powered != '' ) powered+= ' class=' + power_class;
            //powered+= '>' + (Math.round( k_employee * 100 )/ 100 ) + '%</span>';
            powered+= '>' + (Math.round( k_employee * 10000 )/ 100 ) + '%</span>';

            var k = 1.4286*(1 - 0.3/k_employee);
            $("#u2020_text").append( '<div id=k_emp class=hide>' + k +'</div>' );
            var text_hep = '';
            if ( data.employee_count < 1000 ) {
                var k_max =  1.4286*(1 - 0.3/(1000/data.project.min_employees_required));
                $("#u2020_text").append( '<div id=k_emp_max class=hide>' + k_max +'</div>' );
            }
            // current_step_time_lef current_step_min_time
            $("#u2020_text").append( '<div id=project_step data-step= ' + data.project.current_step
                + ' data-left=' + data.project.current_step_time_left
                + ' data-min=' + data.project.current_step_min_time
                + ' class=hide></div>' );

            console.log("---step=" + data.project.current_step + ', left=' + data.project.current_step_time_left);
            // информация о гипотезах -- только для второй стадии
            if ( data.project.current_step == 2 ||
                // или для случая, когда заверешена первая стадия (не осталось чего еще исследовать)
                ( data.project.current_step == 1 && data.project.current_step_time_left == 0 )
            ) {
                text_hep += '<div id=hepotesis>';
                var last_proc = 0;
                var last_day = 0;
                for( var g=0; g<data.project.hepotesis.length; g++  ) {
                    var hepot = data.project.hepotesis[g];
                    // пропускаем заведомо не нужеые гипотезы
                    if ( last_proc == "100.00") {
                        if ( last_day < hepot.hypotesis_lengths ) continue;
                    }

                    text_hep += '<div class=hep_row>';
                    text_hep += '<div>' + hepot.success_probabilities + '%</div>';
                    text_hep += '<div>Длительность: ' + hepot.hypotesis_lengths + '</div>';
                    text_hep += '<div class=my_hep data-len="'+ hepot.hypotesis_lengths +'"></div>';
                    text_hep += "</div>";
                    // hypotesis_lengths
                    // length_modifiers
                    // success_probabilities
                    // id
                    last_proc = hepot.success_probabilities;
                    last_day = hepot.hypotesis_lengths;
                }
                text_hep+= '</div>';
                $("#u2020_text").append( text_hep );
            }

            // запросим список бонусов
            $.get( api_unit_bonus, {id:unit_id}).done( function ( data ){
                console.log("---api_unit_bonus---");
                console.info( data );
                var k_bonus = parseFloat( $("#k_emp").text() );
                var k_max = 1.0;
                if ( $("#k_emp_max").length == 1) {
                    k_max = parseFloat( $("#k_emp_max").text() );
                }
                for( var b=0; b<data.length; b++ ){
                    var bonus = data[b].bonus;
                    if ( bonus == 1) continue;
                    k_bonus *= bonus;
                    if ( k_max > 1 ) {
                        k_max *= bonus;
                    }
                }

                if ( $("#project_step").attr('data-step') == 3 ) {
                    var day_left = $("#project_step").attr('data-left');
                    if (  day_left == $("#project_step").attr('data-min') ) {
                        $("#u2020_text").append("прогноз на изучение: " + (Math.round(10 * day_left / k_bonus )/10 ) + ' дней' ) ;
                    }
                }

                //$("#u2020_text").append("k_bonus=" + k_bonus);
                $(".my_hep").each( function (){
                    var len = parseInt( $(this).attr('data-len') );
                    var row_text = '<span title="текущие бонусы и текущее число ученых">('+Math.round(10 * len / k_bonus )/10 + ')</span>';
                    if ( k_max > 1 ) {
                        row_text+= ' <span title="для 1000 ученых">[' + Math.round(10 * len / k_max )/10 + ']</span>';
                    }
                    $(this).html( row_text );
                });
            });

        }
        str+= powered;

        var step = "step" + data.project.current_step + "_turn_count";
        console.log( step );
        console.info( data.project[step] );

        str += " <span>";
        var left = -1;
        if ( data.project[step] == 0 ) {
            str += " дней до завершения: <span class=unit_curr>" + data.project.current_step_min_time + "</span>";
            left = data.project.current_step_time_left;
        } else {
            str += " прогноз завершения, дней: ";
            // сколько изучили
            var speed  = ( data.project.current_step_min_time - data.project.current_step_time_left ) / data.project[step];

            left = Math.ceil( data.project.current_step_time_left / speed );
            str+= "<span class=unit_curr>" + left + "</span>";
        }

        str+= "</span>";

        // сверхпроводники
        $("#u2020_ico").append("<span id=superconductor></span>");
        //str+= " <span id=superconductor></span>";
        $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
            console.log('superconductor');
            console.info(data);
            // 300997
            if ( data[300137].artefact_id == 300997 ) return;

            $("#superconductor").html( "<img id=img_superconductor class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/20286716.png>");

            $("#img_superconductor").click(function(){
                $("#superconductor").html("...переставляем....");

                var token = $("#my_token").text();
                console.info( token );

                $.post( api_artefact_attache, {id:unit_id, token:token, artefact_id:300997}).done( function( data ) {
                    console.log("attached = " + unit_id );
                    if ( data == 0 ) {
                        $("#superconductor").html("вроде бы поставили").addClass('unit_big');
                    } else {
                        $("#superconductor").html("наверное, что-то пошло не так").addClass('unit_small');
                    }
                });

            });

        });

        // уникальные дивы для управления артефактами
        if ( data.project.current_step == 1 ){
            $("#u2020_ico").append('<span id=step1start></span>')
            //str+= " <span id=step1start></span>";

            // id: "300141", name: "Исследования", symbol: "research"

            $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
                console.log("---300141----");
                console.info(data);
                // 302782 +25% к гипотезе
                if ( data[300141].artefact_id == 302766 ) {
                    if ( left == 0 ) {
                        // надо удалить бонус для первого этапа
                        $("#step1start").html( "<img id=img_step1start class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/141725100408.gif>");
                        $("#step1start").css('background-color', 'red');

                        $("#img_step1start").click(function(){
                            console.log("img_step1start = " + unit_id );
                            $("#step1start").html("...переставляем....");

                            var token = $("#my_token").text();
                            console.info( token );

                            $.post( api_artefact_remove, {id:unit_id, token:token, artefact_id:302766}).done( function( data ) {
                                console.log("remove = " + unit_id );
                                if ( data == 0 ) {
                                    $("#step1start").html("вроде бы удалили").addClass('unit_big');
                                    $("#step1start").css('background-color', 'white');

                                } else {
                                    $("#step1start").html("наверное, что-то пошло не так").addClass('unit_small');
                                }
                            });
                        });
                    }
                    console.log("---302766----");
                    return;
                }

                $("#step1start").html( "<img id=img_step1start class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/141725100408.gif>");

                $("#img_step1start").click(function(){
                    console.log("img_step1start = " + unit_id );
                    $("#step1start").html("...переставляем....");

                    var token = $("#my_token").text();
                    console.info( token );

                    $.post( api_artefact_attache, {id:unit_id, token:token, artefact_id:302766}).done( function( data ) {
                        console.log("attached = " + unit_id );
                        if ( data == 0 ) {
                            $("#step1start").html("вроде бы поставили").addClass('unit_big');
                        } else {
                            $("#step1start").html("наверное, что-то пошло не так").addClass('unit_small');
                        }
                    });

                });

            });
        }
        if ( data.project.current_step == 1 ) {
            console.log("====left=" + left);
            if ( left > -1 ) {
                if ( left == 1 || left == 2 ) {
                    //str+= " <span id=step1to2></span>";
                    $("#u2020_ico").append('<span id=step1to2></span>');

                    // id: "300141", name: "Исследования", symbol: "research"

                    $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
                        console.info(data);
                        // 302782 +25% к гипотезе
                        if ( data[300141].artefact_id == 302782 ) return;

                        $("#step1to2").html( "<img id=img_step1to2 class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/142445100408.gif>");

                        $("#img_step1to2").click(function(){
                            console.log("img_step1to2 = " + unit_id );
                            $("#step1to2").html("...переставляем....");

                            var token = $("#my_token").text();
                            console.info( token );

                            $.post( api_artefact_attache, {id:unit_id, token:token, artefact_id:302782}).done( function( data ) {
                                console.log("attached = " + unit_id );
                                if ( data == 0 ) {
                                    $("#step1to2").html("вроде бы поставили").addClass('unit_big');
                                } else {
                                    $("#step1to2").html("наверное, что-то пошло не так").addClass('unit_small');
                                }
                            });

                        });

                    });

                    // 302766 - 30% для 1 этапа
                    // 302782 +25% к гипотезе
                    // 302792 +30 для 3 эатпа
                }
            }
        }
        // Удаление +25% на первом этапе
        if ( ( data.project.current_step == 2 && data.project.current_step_min_time == data.project.current_step_time_left ) ||
            ( data.project.current_step == 1 && left == 0 )
        ) {
            //str+= " <span id=step2begin></span>";
            $("#u2020_ico").append('<span id=step2begin></span>');
            $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
                console.log('--300141--302782---');
                console.info(data);
                // 302782 +25% к гипотезе
                if ( data[300141].artefact_id != 302782 ) {
                    console.log('--no--');
                    return;
                }

                $("#step2begin").html( "<img id=img_step2begin class=unit_ico title='Удалить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/142445100408.gif>");
                $("#step2begin").css('background-color', 'red');

                $("#img_step2begin").click(function(){
                    console.log("img_step2begin = " + unit_id );
                    $("#step2begin").html("...переставляем....");

                    var token = $("#my_token").text();
                    console.info( token );

                    $.post( api_artefact_remove, {id:unit_id, token:token, artefact_id:302782}).done( function( data ) {
                        console.log("remove = " + unit_id );
                        if ( data == 0 ) {
                            $("#step2begin").html("вроде бы удалили").addClass('unit_big');
                            $("#step2begin").css('background-color', 'white');

                        } else {
                            $("#step2begin").html("наверное, что-то пошло не так").addClass('unit_small');
                        }
                    });

                });

            });
        }

        if ( ( data.project.current_step == 3 && data.project.current_step_min_time == data.project.current_step_time_left ) ){
            //if ( ( data.project.current_step == 3 && 0 == data.project.current_step_time_left ) ){
            //str+= " <span id=step3begin></span>";
            $("#u2020_ico").append('<span id=step3begin></span>');
            $.post( api_list_artefact, {id:unit_id}).done( function( data ) {
                console.info(data);
                // 302782 +30% к 3 этапа
                if ( data[300141].artefact_id == 302792 ) return;

                $("#step3begin").html( "<img id=img_step3begin class=unit_ico title='Поставить ииновацию' src=https://virtonomica.ru/i/app/virtonomica/artefact/data/143247100408.png>");
                //$("#step3begin").css('background-color', 'red');

                $("#img_step3begin").click(function(){
                    console.log("img_step3begin = " + unit_id );
                    $("#step3begin").html("...переставляем....");

                    var token = $("#my_token").text();
                    console.info( token );

                    $.post( api_artefact_attache, {id:unit_id, token:token, artefact_id:302792}).done( function( data ) {
                        console.log("remove = " + unit_id );
                        if ( data == 0 ) {
                            $("#step3begin").html("вроде бы поставили").addClass('unit_big');
                            //$("#step3begin").css('background-color', 'white');

                        } else {
                            $("#step3begin").html("наверное, что-то пошло не так").addClass('unit_small');
                        }
                    });

                });

            });
        }

        return str;
    }

    function numberWithSpaces(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    /**
     * вычисляет максимальный уровень технологии для заданной квалификации игрока
     *
     * @param q квалификация игрока
     * @returns {number}
     */
    function calcTechMax(q){
        return Math.floor(10*Math.pow(q/0.0064, 1/3))/10 ;
    }

    /**
     * вычисляет максимальное кол-во работающих на предприятиях отрасли для заданной квалификации игрока (топ-3)
     * function calcPersonalTop3(q, type)
     *
     *@param q - квалификация игрока
     *
     */
    function calcPersonalTop3( q, type){
        return ((2*q*q + 6*q)*getK3(type));
    }
    /**
     * вычисляет максимальное квалификацию работающих при заданных их численности и квалификации игрока (обратна calcPersonalTop1())
     * @param q квалификация игрока
     * @param p численность персонала
     * @param type
     * @returns {number}
     */
    function calcQualTop1(q, p, type){
        if(p==0) return 0.00;
        //if((mode=='Crocuta')&&(type=='office')){return Math.log(14/4.15*q*q/p)/Math.log(1.4);}
        return Math.log(0.2*14*getK1(type)*q*q/p)/Math.log(1.4);
    }

    /**
     * Вычисляем уровень квалификации работников на уровне 120%
     *
     * @param qv квалификация работчниов на уровне 100%
     * @returns {number}
     */
    function calcQualTop1_up( qv )
    {
        return Math.log( ( 1.2 * 1.2 ) * Math.pow(1.4, qv ) )/ Math.log(1.4);
    }
    /**
     * вычисляет максимальное кол-во работающих с заданной квалификацией на предприятии для заданной квалификации игрока (топ-1)
     *
     * @param q квалификация игрока
     * @param qp квалификация персонала
     * @param type
     * @returns {number}
     */
    function calcPersonalTop1(q, qp,type){
        //if(type=='office'){return Math.floor(14*q*q/Math.pow(1.4, qp)/4.15);}
        return Math.floor(0.2*getK1(type)*14*q*q/Math.pow(1.4, qp));
    }
    /**
     *  возвращает к для расчётов нагрузки по типу для топ-1
     * @param type тип подразделения
     * @returns {number}
     */
    function getK1(type)
    {
        switch(type)
        {
            case('shop'):
            case('restaurant'):
            case('lab'):
                return 5;
                break;
            case('workshop'):
                if (/anna/.test(window.location.href)) {
                    return 100;
                    break;
                }
                else {
                    return 50;
                    break;
                }
            case('mill'):
                return 5;
                break;
            case('sawmill'):
                return 12.5;
                break;
            case('animalfarm'):
                return 7.5;
                break;
            case('medicine'):
            case('fishingbase'):
                return 12.5;
                break;
            case('farm'):
                return 20;
                break;
            case('orchard'):
                return 15;
                break;
            case('mine'):
                if (/anna/.test(window.location.href)) {
                    return 50;
                    break;
                }
                else {
                    return 100;
                    break;
                }
            case('office'):
                //if(mode=='Crocuta') return
                return 1;
                break;
            case('service_light'):
                return 1.5;
                break;
            case('power'):
                return 75.0;
                break;
            case('repair'):
                return 2.5;
                break;
            case('fuel'):
                return 2.5;
                break;
            case('educational'):
                return 1.5;
                break;
            case('it'):
                return 1;
                break;
            case('villa'):
            case('warehouse'):
            case('unknown'):
            default:
                return 0;
        }//end switch
    }
    /**
     * возвращает к для расчётов нагрузки по типу для топ-3
     *
     *@param type строка с запрашиваемым типом
     */
    function getK3(type)
    {
        switch(type)
        {
            //case('shop'):
            case('shop'):
            //case('restaurant'):
            case('restaurant'):
            case('lab'):
            case('research'):
                return 5;
                break;
            case('workshop'):
                if (/anna/.test(window.location.href)) {
                    return 100;
                    break;
                }
                else {
                    return 50;
                    break;
                }
            case('mill'):
                if (/anna/.test(window.location.href)) {
                    return 100;
                    break;
                }
                return 50;
                break;
            case('sawmill'):
                if (/anna/.test(window.location.href)) {
                    return 100;
                    break;
                }
                return 50;
                break;
            case('animalfarm'):
            case('animal'):
                return 7.5;
                break;
            case('medicine'):
            case('fishingbase'):
            case('fishing'):
                return 12.5;
                break;
            case('farm'):
                return 20;
                break;
            case('orchard'):
                return 15;
                break;
            case('mine'):
            case('mining'):
                if (/anna/.test(window.location.href)) {
                    return 50;
                    break;
                }
                else {
                    return 100;
                    break;
                }
            case('office'):
            case('management'):
                return 1;
                break;
            //case('service_light'):
            case('service_light'):
                return 1.5;
                break;
            case('power'):
                return 75.0;
                break;
            case('repair'):
            case('car'):
                return 2.5;
                break;
            case('fuel'):
                return 2.5;
                break;
            case('educational'):
                return 1.5;
                break;
            case('it'):
                return 1;
                break;
            case('villa'):
            case('warehouse'):
            case('unknown'):
            default:
                return 0;
        }//end switch
    }//end getType()

    function check_url( str ){
        var pos = location.href.indexOf( str );
        if (pos > 0) return true;
        return false;
    }
}
if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}