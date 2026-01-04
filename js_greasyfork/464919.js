// ==UserScript==
// @name         GL_helper
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Выбор существа ГЛ по текстовому вводу, воскресить всех по 1 клику
// @author       Something begins
// @license      joe mamma
// @match        https://www.heroeswm.ru/leader_*
// @match        https://my.lordswm.com/leader_*
// @match        https://lordswm.com/leader_*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464919/GL_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/464919/GL_helper.meta.js
// ==/UserScript==
const duration = 500;
// Без паузы сервер гвд не обрабатывает все запросы по ресу существ
const fetchWithDelay = async (url) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return fetch(url).then(response => console.log(response.status));
};
function recruitPage(){
    if (location.href.includes("leader_army_exchange")) return;
    let chosen_creatures = [];
    let available_creatures = {}
    let army_pos_i = 1
    function add_new_cre(cre_index, cre_count){
        let index;
        if (obj_army.filter(cre => cre.link == 0).length>=1) index = obj_army.filter(cre => cre.link != 0).length+1
        else {
            index = army_pos_i;
            army_pos_i++;
            if (army_pos_i>=8) army_pos_i = 1
        }
        obj_army[index].link = cre_index;
        obj_army[index].count = 1;
        show_details(cre_index)
        if (chosen_creatures.length>7){
            chosen_creatures = []
        }
    }
    document.querySelector("#hwm_no_zoom").insertAdjacentHTML("beforebegin",
                                                              `<div id="cre_select_div" style = "  position: absolute;
left: 10%;
top: 15%;
transform: translate(-50%, -50%);">
<label for="cre_select_input">Выбрать существо:</label>
<input type="text" name="creature_choice" list="cre_select" id = "cre_select_input">
<datalist name="Выбрать существо" id="cre_select"></datalist>
</div>`
                                                             )
    const datalist = document.querySelector("#cre_select")
    const input = document.querySelector("#cre_select_input")
    for (const creature of obj){
        if (creature) {
            available_creatures[creature.name] = obj.indexOf(creature)
            datalist.insertAdjacentHTML(`beforeend`, `<option id = "cre_choice${obj.indexOf(creature)}" value="${creature.name}"></option>`);
        }
    }
    let eventSource = null;
    input.addEventListener('keydown', (event) => {
        eventSource = event.key ? 'input' : 'list';
    });
    function creRecruited(creLink){
        const links = [];
        for (const cre of obj_army){
            if (!cre) continue;
            links.push(parseInt(cre.link));
        }
        return links.includes(parseInt(creLink)) ? true : false;
    }
    input.addEventListener('input', (event)=>{
        let chosen_creature;
        let possible_options = [...datalist.children].filter(option => option.value.toLowerCase().includes(input.value.toLowerCase()));
        if (eventSource === 'list') chosen_creature = available_creatures[event.target.value.trim()]
        if (possible_options.length === 1) chosen_creature = possible_options[0].id.match(/cre_choice(\d+)/)[1];
        if (chosen_creature !== undefined){
            if (creRecruited(chosen_creature)) return;
            add_new_cre(chosen_creature, 1)
            chosen_creatures.push(chosen_creature)
        }
    });

    const targetElement = document.querySelector('#reset_div');
    console.log(targetElement);

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                targetElement.style.display = "inline";
            }
        }
    });

    observer.observe(targetElement, { attributes: true, attributeFilter: ['style'] });
}
function resPage(){
    const match = document.body.innerHTML.match(/sign=(.*?)\"/);
    if (!match) throw new Error("sign not found");
    const sign = match[1];
    document.querySelector("#set_mobile_max_width > div:nth-child(2)").insertAdjacentHTML("beforeend",
                                                                                          `
<div class="home_button2 btn_hover2" style="width: 10em; margin: auto; margin-top: 0.5em; margin-bottom: 1em;">
<a id = "script_res" style="text-decoration: none;"><div style="width: 100%;">Воскресить всех</div></a>
</div>
`);
    const resButton = document.querySelector("#script_res");
    const tbody = document.querySelector("#set_mobile_max_width > table > tbody");
    const urls = [];
    for (const tr of tbody.children){
        const all_a = Array.from(tr.querySelectorAll("a"));
        const war_a = all_a.filter(a => {return a.href.includes("war")})[0];
        const cre_a = all_a.filter(a => {return a.href.includes("army_info")})[0];
        if (!war_a || !cre_a) continue;
        const warid = war_a.href.match(/\d+/)[0];
        const creId = cre_a.href.match(/name=(.*)/)[1];
        urls.push(`${location.origin}/leader_guild.php?action=res_old&warid=${warid}&sign=${sign}&mon_id=${creId}`);

    }
    console.log(urls);

    resButton.addEventListener("click", event=>{
        event.preventDefault();
        resButton.parentElement.classList.add("home_disabled");
        function fetchAll(i = 0){
            if (i >= urls.length) location.reload();
            fetch(urls[i])
                .then(response => {
                //console.log(`Response from ${urls[i]}:`, response.status);
            })
                .catch(error => {
                console.error(`Error fetching ${urls[i]}:`, error);
            })
                .finally(() => {
                resButton.firstChild.innerHTML = `Рес ${i+1}/${urls.length}`;
                setTimeout(() => {
                    fetchAll(i + 1);
                }, duration);
            });
        }
        fetchAll();

    });
}
if (location.href.includes("leader_army")) recruitPage();
if (location.href.includes("leader_ressurect_old")) resPage();
