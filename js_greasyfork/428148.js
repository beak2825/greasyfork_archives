// ==UserScript==
// @name        Amazon Fake Review Analyzer (ReviewMeta)
// @description It returns ReviewMeta.com percentage of potentially fake reviews on amazon and it recalculates the "true" star score excluding "fake" reviews
// @match       https://www.amazon.it/*
// @match       https://www.amazon.de/*
// @match       https://www.amazon.co.uk/*
// @match       https://www.amazon.fr/*
// @match       https://www.amazon.es/*
// @match       https://www.amazon.com/*
// @version     1.2.1
// @author      SH3LL
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/428148/Amazon%20Fake%20Review%20Analyzer%20%28ReviewMeta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428148/Amazon%20Fake%20Review%20Analyzer%20%28ReviewMeta%29.meta.js
// ==/UserScript==


function get_stars_number(url) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            method: 'GET',
            responseType: 'document',
            synchronous: false,
            url: url,
            onload: (resp) => {
                  const doc = document.implementation.createHTMLDocument().documentElement;
                  doc.innerHTML = resp.responseText;
                  
                  let stars_number = doc.querySelector('#adjusted-rating-large');
                  let percent = doc.getElementsByTagName('small');
                  
                  let missing_reviews = doc.getElementsByTagName('center');
              
                  if(stars_number !== null) {
                    stars_number=stars_number.innerText;
                    for(let perc of percent){
                      if(perc.innerText.includes("of potentially unnatural reviews removed")){
                        percent=perc.children[0].children[0].innerText;
                        break;
                      }
                    }
                  }
                  
                  resolve([stars_number,percent]);
           }
        });
    });
}

async function main(){
    let location="it";
    if(window.location.href.includes(".it")){location="it";}
    if(window.location.href.includes(".de")){location="de";}
    if(window.location.href.includes(".fr")){location="fr";}
    if(window.location.href.includes(".es")){location="es";}
    if(window.location.href.includes(".co.uk")){location="uk";}
    if(window.location.href.includes(".com")){location="us";}
  
  
    if(window.location.href.includes("/dp/") || window.location.href.includes("/gp/product/") ){
      
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
      
      let rev_url;
      if(location==="us" /*america (.com)*/ ) {rev_url="https://reviewmeta.com/amazon/";} else {rev_url="https://reviewmeta.com/amazon-"+location+"/";}
      
      
      rev_url=rev_url+amz_code;
      
      
      let stars_number_and_percent = await get_stars_number(rev_url); // get data from ReviewMeta
      
      
      let stars_block = document.getElementsByClassName('a-fixed-left-grid AverageCustomerReviews a-spacing-small');
      
      if(stars_number_and_percent[0]!==null) {// dati trovati nel database
        let message_review = document.createElement('small'); //review info
        let message_percent = document.createElement('small'); //review info
        let review_value = document.createElement('label'); //review info
        let percent_value = document.createElement('label'); //review info
        let link_reviewmeta = document.createElement('a'); //link to ReviewMeta
        
        
        message_review.innerText="ReviewMeta Filtered Reviews "+"["+location.toUpperCase()+"]: ";
        message_review.style.color = 'darkorange';
        review_value.innerText=stars_number_and_percent[0]+"/5";
        review_value.style.color = 'firebrick';
        
        message_percent.innerText="Potentially Fake Reviews ["+location.toUpperCase()+"]: ";
        message_percent.style.color = 'darkorange';
        percent_value.innerText=stars_number_and_percent[1];
        percent_value.style.color = 'firebrick';
        message_percent.append(percent_value);
        
        link_reviewmeta.innerText="[Open this product in ReviewMeta]";
        link_reviewmeta.style.color = 'forestgreen';
        link_reviewmeta.href = rev_url;
        
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        let div3 = document.createElement("div");
        
        div1.append(message_review);
        div1.append(review_value);
        div2.append(message_percent);
        div2.append(percent_value);
        div3.append(link_reviewmeta);
        
        stars_block[0].append(div1);
        stars_block[0].append(div2);
        stars_block[0].append(div3);
      }else{ //dati non trovati nel database
        
        let message_review = document.createElement('small'); //review info
        let link_reviewmeta = document.createElement('a'); //link to ReviewMeta
        
        message_review.innerText="Missing product in ReviewMeta DataBase-"+location.toUpperCase()+" or missing reviews for Amazon-"+location.toUpperCase();        
        message_review.style.color = 'firebrick';
        
        link_reviewmeta.innerText="[Add this product to Database]";
        link_reviewmeta.style.color = 'forestgreen';
        link_reviewmeta.href = rev_url;
        
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        
        div1.append(message_review);
        div2.append(link_reviewmeta);
                
        stars_block[0].append(div1);
        stars_block[0].append(div2);
        
      }
      
    }
}

main();