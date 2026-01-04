// ==UserScript==
// @name        POLITO Lectures Copy Button
// @match       https://didattica.polito.it/pls/portal30/sviluppo.pagina_corso.main*
// @author      prestidigitonium
// @version     1.0
// @description add copy buttons for videos on didattica.polito.it
// @run-at      document-idle
// @grant        GM_xmlhttpRequest
// @license GPL3
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/447115/POLITO%20Lectures%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/447115/POLITO%20Lectures%20Copy%20Button.meta.js
// ==/UserScript==

function get_video_snippet(bbbid,id_inc,id_inc_prov){
   return new Promise(function (resolve, reject) {   
        $.ajax({
          data: {
            "p_bbbid": bbbid,
            "p_id_inc": id_inc,
            "p_id_inc_prov": id_inc_prov
          },
          type: "POST",
          url: "https://didattica.polito.it/pls/portal30/sviluppo.virtual_classroom_dev.getVCTpl"
          }).success(function(r) {
            var res = r
            resolve(res);
          });
   });
}

async function main() {
  let links_list;
  
  //loop on lectures list
  let ul_lists = document.getElementsByTagName("ul");
  let lessons_list, all_links_button_hook, lez_counter=1;
  
  for(let ul_list of ul_lists){ if(ul_list.id.includes("navbar_left_menu")){lessons_list = ul_list.children; all_links_button_hook=ul_list;}}
  for(let lesson of lessons_list){
    
    // ---------- RICHIESTA API ----------
    
    //grabba dati per la richiesta API
    let bbbid=lesson.children[0].getAttribute("data-bbb-id");
    let id_inc=lesson.children[0].getAttribute("data-id_inc");
    let id_inc_prov=lesson.children[0].getAttribute("data-id_inc-prov");
    
    //Richiesta API per ottenere lo snippet del player
    let html_page = await get_video_snippet(bbbid,id_inc,id_inc_prov);
    //converto snippet html in DOM
    let dom_page = document.createElement('html');
    dom_page.innerHTML = html_page;
    
    //ottengo dati dallo snippet
    let vid_url = dom_page.getElementsByTagName("video")[0].children[0].src;
    let vid_data = lesson.children[0].getAttribute("data-vc").replaceAll("del ","").trim().replaceAll("/","-").trim();
    let titolo = lesson.children[0].innerText.trim().replaceAll("/","-").trim();
    
    
    // ---------- COSTRUZIONE NOME LEZIONI ----------
    
    //mette "0" davanti alle prime 9 lezioni
    let curr_lez_number= lez_counter<10 ? "0"+lez_counter : lez_counter;
    //costruisce nome lezioni
    let lez_number_padding = "LEZ_"+lez_counter;
    let final_rename = lez_number_padding + " - " + titolo.replaceAll(vid_data,"").trim() + " ["+vid_data+"]";
    
    // ---------- COSTRUZIONE BOTTONI ----------
    
    //rinomina lezione nella lista
    lesson.children[0].innerText = final_rename;
    
    //BUTTON copy video link    
    let button_cpy_link_el = document.createElement("button");
    //button_cpy_link_el.style.color="darkorange";
    button_cpy_link_el.innerText = "🔗 Link";
    button_cpy_link_el.onclick = function(){ event.preventDefault(); navigator.clipboard.writeText(vid_url);};
    
    //BUTTON copy video title   
    let button_cpy_text_el = document.createElement("button");
    //button_cpy_text_el.style.color="darkorange";
    button_cpy_text_el.innerText = "🏷️ Title";
    button_cpy_text_el.onclick = function(){ event.preventDefault(); navigator.clipboard.writeText(final_rename) };
    button_cpy_text_el.style.marginLeft="5px";
    
    //DIV contenente i bottoni
    let div2 = document.createElement("div");
    div2.style.paddingTop="3px";
    div2.append(button_cpy_link_el,button_cpy_text_el);
    lesson.append(div2);
    
    //accumula i link
    links_list=links_list+" \n"+vid_url;
    
    //contatore numero lezione
    lez_counter=parseInt(lez_counter)+1;
    
    //debug printing
    console.log(final_rename);
    console.log(vid_url);
    
  }
  
  //BUTTON copy ALL video links
  let button_cpy_all_links = document.createElement("button");
  //button_cpy_all_links.style.color="darkorange";
  button_cpy_all_links.innerText = "🔗 All links";
  button_cpy_all_links.onclick = function(){ navigator.clipboard.writeText(links_list);};
  
  all_links_button_hook.prepend(button_cpy_all_links);
  
}

main();