// ==UserScript==
// @name         Advanced Novelpia
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  lol
// @author       fienestar
// @match        https://novelpia.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelpia.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460520/Advanced%20Novelpia.user.js
// @updateURL https://update.greasyfork.org/scripts/460520/Advanced%20Novelpia.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement('style');
    const styled = String.raw;
    style.innerHTML = styled`
body > div.am-header.mobile_hidden.s_inv > div > img.s_inv{
  filter: hue-rotate(110deg);
}
font.info_font::-webkit-scrollbar {
  display: none;
}
.mobile_hidden .hash_tag_off {
  font-size: 0.7rem;
  color: #8432df;
  border: 1px solid #8432df;
  border-radius: 10px;
  padding: 0px 7px;
  line-height: 1.25rem;
  user-select: none;
  white-space: nowrap;
}

.mobile_hidden .row {
  margin-left: auto !important;
  margin-right: auto !important;
  max-width: calc(min(60vw, 1200px));
}

.mobile_hidden .up_div {
  display: none;
}

.row .mobile_hidden span[class="s_inv"], .b_19_one,.b_19,.b_19_t,.b_22_one,.b_22,.b_22_t,.b_15_one,.b_15,.b_15_t,.b_free,.b_time,.b_plus,.b_comp,.b_mono,.b_contest2,.b_cont,.b_up,.b_challenge {
  display: none;
}

font + .b_19 {
  display: initial !important;
}

.mobile_hidden span[class="s_inv"] + b {
  text-decoration: line-through;
}

.mobile_hidden.novelbox td:nth-child(2) {
  font-size: 0;
  line-height: 1rem !important;
}

.mobile_hidden .name_st {
  margin-right: 0.5rem;
}

.nav-link.active {
  color: white !important;
}

.mobile_hidden .name_st + .info_font {
  text-wrap: nowrap;
}

.mobile_hidden .b_19 + b{
  color: #d22323;
}

.mobile_hidden .name_st + .info_font + .info_font {
  margin-left: 0.5rem;
}

.mobile_hidden .name_st + .info_font + br + .info_font {
  display: block;
  overflow: scroll;
  height: 2rem;
}

.mobile_hidden .name_st + .info_font + br + .info_font + br {
  display: none;
}

.mobile_hidden .name_st + .info_font + br + .info_font + br + br + .info_t_box {
  display: block;
  min-height: 5.375rem;
}

.row:not([id=top100_page]) .mobile_hidden.novelbox{
  max-width: 50%;
  padding: 1rem 1.5rem !important;
}

.m_del_btn {
  border: 1px solid #FFF !important;
}

.cover_style {
  height: 195px !important;
  width: 130px !important;
}

.cover-wrapper {
  display: none;
}

img[src="/img/new/list/sponsor.png"], img[src="/img/new/list/sponsor.png"] + div {
  display: none;
}

a, a:hover {
  color: inherit !important;
}
`
    document.head.prepend(style);
    Array.from(document.querySelectorAll('.name_st')).forEach(title => {
        const href = (title.onclick + '').match(/'([^']+)'/)?.[1]
        if(!href) return;
        delete title.onclick;

        const a = document.createElement('a');
        a.classList.add("novel-title");
        a.href = href;
        a.innerText = title.innerText;
        title.innerHTML = "";
        title.appendChild(a);
    });

    Array.from(document.getElementsByClassName('hash_tag_off')).forEach(tag => {
        const a = document.createElement('a');
        const text = tag.innerText;
        a.innerText = text;
        a.href = `/search/hash/date/1/${text.slice(1)}`
        tag.innerHTML = "";
        tag.appendChild(a)
    });

    function dateDiffToString(diff){
        const intervals = [1000, 60,60,24];
        const interval_names = ["밀리초", "초", "분", "시간", "일"];
        let i;
        for(i=0; i!=5; ++i){
            if(diff < intervals[i]) break;
            diff /= intervals[i];
        }
        return `${diff | 0}${interval_names[i]}후`;
    }

    async function trackNextTimeUnit(to, cb){
        const check = [24 * 3600 * 1000, 3600 * 1000, 60 * 1000, 1000, 100];
        const name = ['d', 'h', 'm', 's'];
        function sleep(ms){
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        let i = 0;
        let current = Date.now();
        while(Math.ceil((to - current)/check[i]) <= 1 && i+2 != check.length) ++i;
        cb(Math.ceil((to - current)/check[i]), i);
        let old = Math.ceil((to - current)/check[i]);
        while(to > current){
            do{
                const need = (to - current) % check[i+1];
                await sleep(need <= 10 ? check[i+1] : need);
                current = Date.now();
            }while(old == Math.ceil((to - current) / check[i]) && to > current);
            const oldString = old + name[i];
            while(Math.ceil((to - current)/check[i]) <= 1 && i+2 != check.length) ++i;
            old = Math.ceil((to - current)/check[i]);
            if(old > 0) cb(old, i);
        }
        cb(0, name[name.length-1]);
    }

    Array.from(document.querySelectorAll('div[onclick^="get_next_episode("]')).forEach(view_next => {
        const [matched, novel_no, novel_epi_no] = (view_next.onclick + '').match(/get_next_episode\((\d+), (\d+)\)/)
        view_next.onclick = async () => {
            const res = await new Promise(resolve => $.ajax({
                url: "/proc/mybook",
                data: {
                    "mode" : "get_next_episode",
                    "novel_no" : novel_no,
                    "novel_epi_no" : novel_epi_no
                },
                type: "POST",
                dataType:"json",
                success(response) {
                    resolve(response.result);
                }
            }));
            if(res.wait_episode == "1"){
                const to = new Date(res.content_viewdate);
                const from = new Date;
                const diff = to - from;
                const unit_names = ["일", "시간", "분", "초"];
                trackNextTimeUnit(to, (time, unit) => {
                    console.log(time + unit_names[unit]);
                    if(time === 0)
                        view.innerText = '다음화 보기';
                    else
                        view_next.innerText = time + unit_names[unit] + '후';
                });
            }else if(res.next_episode_no){
                location = "/viewer/"+res.next_episode_no;
            }
        }
    })
})();