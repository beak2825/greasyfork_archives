// ==UserScript==
// @name        Amazon Global Price Comparator
// @description It shows prices across amazon portals (IT,DE,FR,ES,UK,US,CA,AU)
// @match       https://www.amazon.it/*
// @match       https://www.amazon.de/*
// @match       https://www.amazon.co.uk/*
// @match       https://www.amazon.fr/*
// @match       https://www.amazon.es/*
// @match       https://www.amazon.com/*
// @match       https://www.amazon.com.au/*
// @match       https://www.amazon.ca/*
// @version     2.2
// @author      SH3LL
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/428182/Amazon%20Global%20Price%20Comparator.user.js
// @updateURL https://update.greasyfork.org/scripts/428182/Amazon%20Global%20Price%20Comparator.meta.js
// ==/UserScript==

function get_price(url,location) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: url,
            onload: (resp) => {
                  const doc = document.implementation.createHTMLDocument().documentElement;
                  doc.innerHTML = resp.responseText;
                  let grabbed_price=null;

                  // ----------------------------- REGULAR ITEMS ALGORITHM -----------------------------
                  // --- Latest amazon grabber ---
                  if(grabbed_price === null) {
                    grabbed_price = doc.querySelector('span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay'); // id prezzo
                    if(grabbed_price!==null) grabbed_price=grabbed_price.children[1];
                  }
                  // --- PriceBlock of type: OURPRICE ---
                  if(grabbed_price === null) grabbed_price = doc.querySelector('#priceblock_ourprice'); // id prezzo
                  if(grabbed_price === null) {
                    grabbed_price = doc.querySelector('#apexPriceToPay');
                    if(grabbed_price!== null && grabbed_price.children[1]!==null) grabbed_price=grabbed_price.children[1];
                  }// nuova classe id del prezzo
                  if(grabbed_price === null) grabbed_price = doc.querySelector('#priceblock_saleprice') // id prezzo scontato
                  if(grabbed_price === null) grabbed_price = doc.querySelector('#priceblock_dealprice') // id prezzo offerta flash
                  if(grabbed_price === null) grabbed_price = doc.querySelector('#priceblock_pospromoprice') // id prezzo offerta flash

                  // --- PriceBlock of type: "New and Used From.." ---
                  if(grabbed_price === null){
                    let etichette = doc.getElementsByTagName("span"); //ottiene tutti i tag "span" della pagina
                    for(let el of etichette){
                      if(   ( el.innerText.includes("Nuevos") && el.innerText.includes("desde")  ) ||
                              ( el.innerText.includes("Nuovo") && el.innerText.includes("da") ) ||
                              ( el.innerText.includes("Neufs") && el.innerText.includes("occasions") ) ||
                              ( el.innerText.includes("Neu") && el.innerText.includes("ab")  ) ||
                              ( el.innerText.includes("New") && el.innerText.includes("from") )
                          ) {
                              if(el.children[0]!==undefined && el.children[0].children[1]!==undefined){
                                grabbed_price = el.children[0].children[1];
                              }
                              break;

                            }
                    }
                  }

                  // ----------------------------- BOOK ITEMS ALGORITHM -----------------------------
                  // --- PriceBlock of type: APEX ---
                  let price_block=doc.querySelector("#apex_desktop"); //id blocco del prezzo
                  // --- PriceBlock of type: swatchElement (for Books)
                  if(price_block===null && grabbed_price===null) price_block=doc.querySelector("#tmmSwatches");
                  if(price_block!==null && grabbed_price===null){
                    if(price_block.innerText.includes("€") || price_block.innerText.includes("£") || price_block.innerText.includes("$")){ // se il blocco c'è
                      let etichette = price_block.getElementsByTagName("span");
                      for(let el of etichette){
                        if(el.className.includes("a-text-price") && el.getAttribute("data-a-color")==="price"){
                              grabbed_price = el.firstChild;
                              break;
                        }
                        if(el.className.includes("a-price") && el.className.includes("priceToPay")){
                              grabbed_price = el.firstChild;
                              break;
                        }

                        if(el.className.includes("a-size-base") && el.className.includes("a-color-price")){// for books
                              grabbed_price = el;
                              break;
                        }
                        if(el.id==="priceblock_ourprice"){
                          grabbed_price = el;
                          break;
                        }
                      }
                    }
                  }



                  // PASS THE OUTPUT
                  if(grabbed_price !== null && grabbed_price !== undefined && grabbed_price.innerText !== null && grabbed_price.innerText !== undefined && grabbed_price.innerText.trim()!== "" && grabbed_price.innerText.length < 10) {
                    resolve(grabbed_price.innerText); return;
                  }
                  resolve("error"); return;
           }
        });
    });
}

async function main(){

    if(window.location.href.includes("/dp/") || window.location.href.includes("/gp/product/") ){

      //get amazon country
      let my_location = (window.location.href).split("www.amazon.")[1].split("/")[0].trim();

      let amz_code; //get amazon product code
      if(window.location.href.includes("/gp/product/") && window.location.href.includes("?") ){
        amz_code=(window.location.href).split("?")[0].split('/gp/product/')[1];

      }else if(window.location.href.includes("/gp/product/") && !window.location.href.includes("?")){
        amz_code=(window.location.href).split('/gp/product/')[1];

      }else if(window.location.href.includes("/dp/") && window.location.href.includes("?")){
         amz_code=(window.location.href).split("?")[0].split('/dp/')[1].split('/')[0];

      }else if(window.location.href.includes("/dp/") && !window.location.href.includes("?")){
         amz_code=(window.location.href).split('/dp/')[1].split('/')[0];

      }

      //let price_block = document.querySelector('#price');  //VECCHIO HOOK (che non esiste quando il prezzo è fuori stock)
      let price_block = document.querySelector('#desktop_unifiedPrice'); //HOOK
      if(price_block===null || price_block===undefined ) {price_block = document.querySelector('#productOverview_feature_div'); if(price_block!==null && price_block!==undefined) price_block=price_block.children[0];}
      if(price_block===null || price_block===undefined ) {price_block = document.querySelector('#adoptedData');}
      console.log(price_block);
      let tr1 = document.createElement("tr");

      let div1 = document.createElement("div");
      div1.style.position = "relative";
      div1.style.left="100%";

      let message1= document.createElement("label");
      message1.innerText="⏳ Loading Prices..";
      message1.style.color="firebrick";

      tr1.append(div1);
      div1.append(message1);
      //price_block.children[0].children[0].append(tr1);  //VECCHIO HOOK (che non esiste quando il prezzo è fuori stock)
      price_block.append(tr1);

      let locations = ["it","de","fr","es","co.uk","com","com.au","ca"];
      let flags = { "it":"🇮🇹", "de":"🇩🇪", "fr":"🇫🇷", "es":"🇪🇸", "co.uk":"🇬🇧", "com":"🇺🇸","ca": "🇨🇦", "com.au": "🇦🇺" };
      let prices=[],link,min_price=999999999999999999999999999;

      console.log("My Location:"+my_location);

      for(let curr_location of locations){
        let curr_price = await get_price("https://www.amazon."+curr_location+"/dp/"+amz_code , curr_location);

        console.log(curr_location+": price-> " + curr_price)

        if(curr_price!=="error"){
          //clean currency font in the right location
          if(curr_location=="it" || curr_location=="de" ||curr_location=="fr" ||curr_location=="es") {curr_price=curr_price.replace("€","").trim()+"€"}
          if(curr_location=="co.uk") {curr_price=curr_price.replace("£","").trim()+"£"}
          if(curr_location=="com" || curr_location=="com.au" || curr_location=="ca") {curr_price=curr_price.replace("$","").trim()+"$"}

          //get min price
          let cleaned_price="";
          cleaned_price=curr_price.replace(",",".");
          cleaned_price=cleaned_price.replace("$","");
          cleaned_price=cleaned_price.replace("£","");
          cleaned_price=cleaned_price.replace("€","");
          cleaned_price=cleaned_price.trim();//remove spaces

          //calcola minimo prezzo
          if(parseFloat(cleaned_price)< parseFloat(min_price)){ min_price=cleaned_price }

          //creo link
          link= document.createElement("a");
          if(my_location.toString() === curr_location.toString()){
            link.innerText= "<"+ flags[curr_location] + " " + curr_price.replace(".",",")+">";
          }else{
            link.innerText= "["+ flags[curr_location] + " " + curr_price.replace(".",",")+"]";
          }

          link.href="https://www.amazon."+curr_location+"/dp/"+amz_code;
          link.style.color="dodgerblue";
          link.style.paddingLeft = "5px";
          link.style.paddingRight = "5px";

          prices.push(link);

        }else{

          //creo link
          link= document.createElement("a");
          if(my_location.toString() === curr_location.toString()){
            link.innerText= "<"+ flags[curr_location] + " stock-out>";
          }else{
            link.innerText= "["+ flags[curr_location] + " stock-out]";
          }

          link.href="https://www.amazon."+curr_location+"/dp/"+amz_code;
          link.style.color="red";
          link.style.paddingLeft = "5px";
          link.style.paddingRight = "5px";
          //message.style.color="firebrick";

          prices.push(link);

        }
      }

      //REMOVE LOADING
      //price_block.children[0].children[0].removeChild(price_block.children[0].children[0].lastElementChild); //VECCHIO HOOK (che non esiste quando il prezzo è fuori stock)
      price_block.removeChild(price_block.lastElementChild);

      //Appen Price Block
      let tr2 = document.createElement("tr");
      let div2 = document.createElement("div");
      tr2.append(div2);

      for(let curr_price_link of prices){

        let cleaned_price=curr_price_link.innerText.replace("CO.UK","");
        cleaned_price=cleaned_price.replaceAll("🇮🇹","");
        cleaned_price=cleaned_price.replaceAll("🇩🇪","");
        cleaned_price=cleaned_price.replaceAll("🇫🇷","");
        cleaned_price=cleaned_price.replaceAll("🇪🇸","");
        cleaned_price=cleaned_price.replaceAll("🇬🇧","");
        cleaned_price=cleaned_price.replaceAll("🇺🇸","");
        cleaned_price=cleaned_price.replaceAll("🇦🇺","");
        cleaned_price=cleaned_price.replaceAll("🇨🇦","");
        cleaned_price=cleaned_price.replaceAll(",",".");
        cleaned_price=cleaned_price.replaceAll("[","");
        cleaned_price=cleaned_price.replaceAll("]","");
        cleaned_price=cleaned_price.replaceAll("<","");
        cleaned_price=cleaned_price.replaceAll(">","");
        cleaned_price=cleaned_price.replaceAll("$","");
        cleaned_price=cleaned_price.replaceAll("£","");
        cleaned_price=cleaned_price.replaceAll("€","");
        cleaned_price=cleaned_price.trim();//remove spaces

        if(parseFloat(cleaned_price)===parseFloat(min_price)){curr_price_link.style.color="green"}
        div2.append(curr_price_link);

      }

      price_block.append(tr2);

      /*Append "OTHER SELLERS" block
      let other_seller_link=document.createElement("a")
      let tr3 = document.createElement("tr");
      let div3 = document.createElement("div");

      other_seller_link.href="https://www.amazon.it/gp/offer-listing/"+amz_code+"/ref=dp_olp_pn"
      other_seller_link.innerText="{Force Sellers List}"
      other_seller_link.style.textAlign = "center"

      div3.append(other_seller_link);
      tr3.append(div3);

      price_block.append(tr3);*/
    }
}

main();