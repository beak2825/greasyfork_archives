// ==UserScript==
// @name            	Reddit Zoom +
// @match           	https://www.reddit.com/*
// @match           	https://new.reddit.com/*
// @match           	https://sh.reddit.com/*
// @grant           	none
// @version         	2.65
// @author          	atlantique_sud
// @description     	LATEST UPDATE: Full screen 5x4 create post gallery grid - FIX 2
// @license         	MIT
// @namespace https://greasyfork.org/users/1304155
// @downloadURL https://update.greasyfork.org/scripts/495561/Reddit%20Zoom%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/495561/Reddit%20Zoom%20%2B.meta.js
// ==/UserScript==

document.getElementsByTagName('left-nav-top-section')[0].remove();  //deleting Home, Popular & All buttons in upper left sidebar

//Adding invisibiliry to left sidebar
const left_sidebar=document.querySelector("[id='left-sidebar']");
var att = document.createAttribute("style");
left_sidebar.setAttributeNode(att);
left_sidebar.style="visibility:visible";
//end of Adding invisibiliry to left sidebar

//Adding new Home, Popular & All buttons to upper left sidebar
for ( var k=2; k>=0; k--) {
        var p=document.querySelector("[noun='communities_menu']"); //Copying existing Communities button
        var new_element = p.cloneNode(true);
         if (k==2)  {
                    new_element.getElementsByClassName('text-14')[0].innerHTML = 'Home';
                    new_element.querySelector("[style='padding-right: 16px']").href= 'https://www.reddit.com/';
                    new_element.getElementsByTagName('svg')[0].innerHTML='<path d="m19.724 6.765-9.08-6.11A1.115 1.115 0 0 0 9.368.647L.276 6.765a.623.623 0 0 0 .35 1.141h.444v10.001c.001.278.113.544.31.74.196.195.462.304.739.303h5.16a.704.704 0 0 0 .706-.707v-4.507c0-.76 1.138-1.475 2.02-1.475.882 0 2.02.715 2.02 1.475v4.507a.71.71 0 0 0 .707.707h5.16c.274-.001.538-.112.732-.307.195-.195.305-.46.306-.736v-10h.445a.618.618 0 0 0 .598-.44.625.625 0 0 0-.25-.702Z"></path>';

         } else if (k==1) {
                     new_element.getElementsByClassName('text-14')[0].innerHTML = 'Popular';
                     new_element.querySelector("[style='padding-right: 16px']").href= 'https://www.reddit.com/r/popular/';
                     new_element.getElementsByTagName('svg')[0].innerHTML='<path d="M10 0a10 10 0 1 0 10 10A10.01 10.01 0 0 0 10 0Zm0 18.75a8.7 8.7 0 0 1-5.721-2.145l8.471-8.471v4.148H14V6.638A.647.647 0 0 0 13.362 6H7.718v1.25h4.148L3.4 15.721A8.739 8.739 0 1 1 10 18.75Z"></path>';

         }  else  {  new_element.getElementsByClassName('text-14')[0].innerHTML = 'All';
                     new_element.querySelector("[style='padding-right: 16px']").href= 'https://www.reddit.com/r/all/';
                     new_element.getElementsByTagName('svg')[0].innerHTML='<path d="M10 0a10 10 0 1 0 10 10A10.01 10.01 0 0 0 10 0Zm5 17.171V6h-1.25v11.894a8.66 8.66 0 0 1-2.75.794V10H9.75v8.737A8.684 8.684 0 0 1 6.47 18H7v-4H5.75v3.642a8.753 8.753 0 1 1 9.25-.471Z"></path>';

                  }
        document.querySelector("[aria-label='Primary']").insertBefore(new_element, document.querySelector("[aria-label='Primary']").getElementsByClassName('w-100 my-sm border-neutral-border-weak')[0]);
     }
//end of Adding new Home, Popular & All buttons to upper left sidebar

///BLACK DARK MODE
var colors = document.getElementsByTagName('style')[0].innerHTML;
for (var i=0; i<17; i++) colors=colors.replace("#181C1F;", "#000000;");
for ( i=18; i<36; i++) colors=colors.replace("#181C1F;", "#121212;");

for ( i=0; i<14; i++)  colors=colors.replace("#0E1113;", "#000000;");

document.getElementsByTagName('style')[0].innerHTML=colors;
///END of BLACK DARK MODE

//Reddit Following
//b1 - grabs users list from r/subreddits
const following = [];

fetch('https://www.reddit.com/subreddits/').then(function (response) {
	// The API call was successful!
	return response.text();
}).then(function (html) {

	// Convert the HTML string into a document object
	var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    var list1 = doc.getElementsByClassName('drop-choices srdrop');
    var list2 = list1[0].getElementsByClassName('choice');

    for ( i=0; i<list2.length; i++){
     if (list2[i].href.indexOf("https://www.reddit.com/user/") != -1) following.push(list2[i].href);
}

}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});
//end b1

//f1 - puts users list in sidebar
function following_sidebar(){

      var titleNAME = document.getElementsByClassName('text-12 text-secondary-weak tracking-widest');
      if (titleNAME.length==4) {
      titleNAME[3].innerHTML = "FOLLOWING";


      for ( var k=following.length-1; k>=0; k--) {
        var p=document.querySelector("[noun='about_reddit_menu']");
        var new_element = p.cloneNode(true);
        new_element.getElementsByClassName('text-14')[0].innerHTML =  following[k].substring(28, following[k].length-1);
        new_element.querySelector("[style='padding-right: 16px']").href= following[k];
        p.after(new_element);
     }

    p.remove();

    document.querySelector("[noun='advertise_menu']").remove();
    document.querySelector("[noun='help_menu']").remove();
    document.querySelector("[noun='blog_menu']").remove();
    document.querySelector("[noun='careers_menu']").remove();
    document.querySelector("[noun='press_menu']").remove();

    document.querySelector("[noun='content_policy_menu']").remove();
    document.querySelector("[noun='privacy_policy_menu']").remove();
    document.querySelector("[noun='user_agreement_menu']").remove();
    }
}
//end f1

setTimeout(following_sidebar,2000);  //delays function by 2 seconds

//END - Reddit Following

//Create Right Button
function desno_dugme(){
    
    const button_right = document.createElement('button');

    const att1 = document.createAttribute("class");
    att1.value = "button-small px-[var(--rem6)] button-media icon items-center justify-center button inline-flex ";
    button_right.setAttributeNode(att1);

    const att2 = document.createAttribute("style");
    button_right.setAttributeNode(att2);
    button_right.style="visibility:visible";

    button_right.innerHTML='<svg rpl="" fill="currentColor" height="16" icon-name="right-fill" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <!--?lit$542225776$--><!--?lit$542225776$--><path d="m7.207 19.707-1.414-1.414L14.086 10 5.793 1.707 7.207.293l9 9a1 1 0 0 1 0 1.414l-9 9Z"></path><!--?--> </svg>';
       
    return button_right;
} //end - Create Right button

//Create Left Button
function levo_dugme(){

    const button_left = desno_dugme();
    button_left.innerHTML='<svg rpl="" fill="currentColor" height="16" icon-name="left-fill" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <!--?lit$041426208$--><!--?lit$041426208$--><path d="m12.793 19.707-9-9a1 1 0 0 1 0-1.414l9-9 1.414 1.414L5.914 10l8.293 8.293-1.414 1.414Z"></path><!--?--> </svg>';

return button_left;
} //end - Create Left Button

//Download Image Async Function
async function downloadImage(imageSrc) {
  const image = await fetch(imageSrc);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);


  const link = document.createElement('a');
  link.href = imageURL;
  link.download = 'rz+_download.jpeg';

  link.click();

} // end - Download Image Async Function




//Mutation Observer
const observer = new MutationObserver(mutations => {


    //Removing Reddit Logo
    if (document.querySelector("[id='reddit-logo']").getElementsByTagName('span').length>1) {

        document.querySelector("[id='reddit-logo']").getElementsByTagName('span')[0].remove();
        document.querySelector("[id='reddit-logo']").innerHTML = document.querySelector("[id='reddit-logo']").innerHTML.replace("22px", "20px");
    }

    //Bulilding Hamburger Menu
    if (document.querySelectorAll("[id='McDonalds']").length==0){
        const make_hamburger = document.createElement('button');

        var att = document.createAttribute("class");
        make_hamburger.setAttributeNode(att);
        make_hamburger.class = "m:hidden button-medium px-[var(--rem8)] button-plain icon items-center justify-center button inline-flex";

        att = document.createAttribute("id");
        make_hamburger.setAttributeNode(att);
        make_hamburger.id = "McDonalds";

        make_hamburger.style.background='#000000';

        make_hamburger.innerHTML='<span class="flex items-center justify-center"> <span class="flex"> <svg rpl="" fill="currentColor" height="20" icon-name="menu-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"> <path d="M19 10.625H1v-1.25h18v1.25Zm0-7.875H1V4h18V2.75ZM19 16H1v1.25h18V16Z"> </path> </svg> </span> </span>';
        make_hamburger.innerHTML= make_hamburger.innerHTML.replace('viewBox="0 0 20 20"', 'viewBox="0 -2 20 20"');
        document.getElementsByClassName("pr-lg flex gap-xs items-center justify-start")[0].insertBefore(make_hamburger, document.querySelector("[noun='reddit_logo']"));
    //end of Bulilding Hamburger Menu

    //Hamburger Click
        make_hamburger.addEventListener('click', () => {
        if (left_sidebar.style.visibility=="visible")            left_sidebar.style="visibility:hidden" ;
            else if (left_sidebar.style.visibility=="hidden")    left_sidebar.style="visibility:visible" ;
         }) //end - Hamburger Click

    }// end - Hamburger If

    //Creating List of Gallery items
    var tagLI = document.getElementsByClassName('relative flex justify-center mt-0 bg-black/20');  // array of pointers for lists of gallery images
    const a_src_link=[];
    const a_full_res=[];
    for (var i = 0; i <tagLI.length; i++) {

        //Picture number generator

        var current_page=tagLI[i].getAttribute("slot").split("-")[1];

        const att_1 = document.createAttribute("page");
        att_1.value = current_page;
        tagLI[i].setAttributeNode(att_1);

        var next_page ="x" ;
        var j=i;
        var last_page = current_page;
        while (1) {
            if (next_page=="1")  break;
            if  (j==tagLI.length-1) {last_page=next_page; break; }
            j++;
            last_page=next_page;
            next_page=tagLI[j].getAttribute("slot").split("-")[1];
        }

        if (last_page=="x") last_page = current_page;

        const att_2 = document.createAttribute("lastpage");  
        att_2.value = last_page;  
        tagLI[i].setAttributeNode(att_2);   
        //end - Picture number generator

        var text=tagLI[i].getAttribute("gal");   //Attribute for already scanned gallery items

        if (text==null) {

           //Creating array of PREVIEW links
           var src_link = tagLI[i].getElementsByClassName('media-lightbox-img h-full w-full max-h-[100vw] object-contain mb-0 relative')[0].src;
           if (src_link=="") src_link=tagLI[i].getElementsByClassName('media-lightbox-img h-full w-full max-h-[100vw] object-contain mb-0 relative')[0].dataset.lazySrc;
           a_src_link.push(src_link);

           //Attribute gif for gifs
           var gif=src_link.includes('gif');
           const att_3 = document.createAttribute("gif");
           att_3.value=gif;
           tagLI[i].setAttributeNode(att_3);

           //     console.log(i.toString() + "src_link: " + a_src_link[i]);
           //     console.log(i.toString() + ' GIF: ' + gif.toString());
           //end of creating array of preview links

           var full_res;  // link of full resolution image
           if (gif == false){

            var srcset_link =  tagLI[i].getElementsByClassName('media-lightbox-img h-full w-full max-h-[100vw] object-contain mb-0 relative')[0].srcset;
            if (srcset_link=="") srcset_link=tagLI[i].getElementsByClassName('media-lightbox-img h-full w-full max-h-[100vw] object-contain mb-0 relative')[0].dataset.lazySrcset;

            var split_link=srcset_link.split(", ");   //  splits elements of array of srcset into separate links
          

            if (split_link.length<3)      //selects highes res image for low resolution images
                full_res = split_link[1];
            else full_res=split_link[2];

            full_res = "https://i." + full_res.substring(16, full_res.length-5);  //modifies full res image link for zoombale format

        } else {

            full_res=tagLI[i].getElementsByClassName('media-lightbox-img h-full w-full max-h-[100vw] object-contain mb-0 relative')[0].src; //Full res link for gifs
        }

            a_full_res.push(full_res);
            //  console.log(i.toString() + " full_res_link: " + a_full_res[i]);
            //"&nbsp" +  current_page + '/' + last_page + "&nbsp"
            tagLI[i].innerHTML = ' <shreddit-media-lightbox-listener class="nd:visible contents" >' +
                ' <img class="i18n-post-media-img preview-img media-lightbox-img max-h-[100vw] h-full w-full object-contain relative" src="' + src_link + '" /> ' +
                '<div class="zoomable-img-wrapper hidden"> \ <zoomable-img fill-container="true">' + ' \ <img class="i18n-post-media-img media-lightbox-img" \ src="' +
                full_res + ' " \ /> \ </zoomable-img> \ </div> ';



            //Image number feed label
            const img_number = document.createElement('label'); // creates the element
            // tagLI[i].insertBefore(img_number, tagLI[i].getElementsByTagName('shreddit-media-lightbox-listener')[0] );
            tagLI[i].appendChild(img_number);
            img_number.style.position = 'absolute'; // position it
            img_number.style.left = '0px';
            img_number.style.top = '5px';
            img_number.style.backgroundColor='#000000';
            img_number.style.font = "15px arial, serif";
            img_number.style.fontWeight="700";
            img_number.style.color = "#BEC3C7";
//            var space = '&nbsp';
            img_number.innerHTML='&nbsp' + current_page + "/" + last_page+'&nbsp';
            //end Image Number feed label

            //Gallery item scanned -> gal='ok'
            const att = document.createAttribute("gal");
            att.value = "ok";
            tagLI[i].setAttributeNode(att);


            //Adding style to Left Button
            const button_left=levo_dugme();
            button_left.style.position = 'absolute';
            button_left.style.left = '0px';
            button_left.style.top = '500px';
            tagLI[i].querySelector("zoomable-img").insertBefore(button_left, tagLI[i].querySelector("zoomable-img").getElementsByTagName('img')[0]);

            //Left Button Click
            button_left.addEventListener('click', () => {
                var lightbox5;
                const lightbox=document.querySelector("[id='shreddit-media-lightbox']");
                if (lightbox.getElementsByTagName('img').length>0)   {

                   lightbox5=lightbox.getElementsByTagName('img')[1].src;

                   const lightbox6=lightbox5;

                   var current_page=parseInt(lightbox.getElementsByTagName('zoomable-img')[0].innerText.split("\n")[0].split('/')[0]);
                   if (current_page!=1) {
                       var close = document.querySelector("[aria-label='Close lightbox']");
                       close.click();

                       var delayInMilliseconds = 20;
                       setTimeout(function() {
                           var niz_linkova=document.getElementsByClassName('fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center');
                           var niz_slika =[];

                           for (i=0; i<niz_linkova.length; i++ ) {
                               niz_slika[i]=niz_linkova[i].getElementsByTagName('img')[0].src;
                               console.log("niz " + i.toString() + ':  ' + niz_slika[i]);
                           }// end for

                           const ind=niz_slika.indexOf(lightbox6);
                           var element = document.getElementsByClassName("fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center")[ind-1];
                           element.click();

                       }, delayInMilliseconds);
                   } // if  page check
               } // //end if length > 0
           }) // end - Left Button Click

           //Left Image Number label
           const left_img_number = document.createElement('label'); // creates the element
           tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(left_img_number);
           left_img_number.style.position = 'absolute'; // position it
           left_img_number.style.left = '12px';
           left_img_number.style.top = '475px';
           left_img_number.innerText=current_page + '/' + last_page;
           //end Image Number label

           //Left Ctrl label
           const left_ctrl = document.createElement('label');
           tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(left_ctrl);
           left_ctrl.style.position = 'absolute';  // position it
           left_ctrl.style.left = '12px';
           left_ctrl.style.top = '540px';
           left_ctrl.innerText='Ctrl';
           //end left ctrl label

           //Image Resolution Data
           const img_data = document.createElement('label'); // creates the element
           tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(img_data);
           img_data.style.position = 'absolute';  // position it
           img_data.style.left = '7px';
           img_data.style.top = '40px';

           const redbr=i;
           const img = document.createElement("img");
           img.src = full_res;
           img.onload = function(){
               const height = img.height;
               const width = img.width;
               const megapixel= Math.round(height*width*10/ 1000000) / 10 ;

               img_data.innerText= width.toString() + ' x ' + height.toString() + " \n " + megapixel.toString() + ' MP' ;
           }
           //end - Image Resolution Data

           //Download Button

            const download_button = document.createElement('button');
            tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(download_button);
            download_button.style.opacity ="0.99";
            download_button.style.position = 'absolute'; // position it
            download_button.style.left = '5px';
            download_button.style.top = '5px';
            download_button.innerText='Download';


            //Download Click
            download_button.addEventListener('click', () => {
               var lightbox_dw=document.querySelector("[id='shreddit-media-lightbox']");
               var download_link = lightbox_dw.getElementsByClassName('min-h-full object-contain h-full w-full m-0 cursor-zoom-in max-h-full max-w-full')[0].src;

               var dot=download_link.indexOf('.jp');

               download_link='https://i.redd.it/'+download_link.substring(dot-13,dot+4);
               if (download_link[dot+4]=='e') download_link=download_link+'g';

               downloadImage(download_link);
            })//end - Download Click

            //end-Download button

            //Zoom visibility ON/OFF
            //    var test=tagLI[i].querySelector("[id='shreddit-media-lightbox']");
            /*
            var x=tagLI[i].getElementsByTagName('zoomable-img')[0];
            x.addEventListener('click', () => {
                alert('Oh!You Clicked me!');

                if ( download_button.style.opacity =="0.01")  download_button.style.opacity ="0.99";
                else if ( download_button.style.opacity =="0.99")    download_button.style.opacity ="0.01";
            }); */
            //end Zoom visibility ON/OFF

           //Adding style to Right Button
           const button_right =desno_dugme();
           tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(button_right);
           button_right.style.position = 'absolute';
           button_right.style.right = '0px';
           button_right.style.top = '525px';

           //Right Button Click
           button_right.addEventListener('click', () => {

               var lightbox5;
               const lightbox=document.querySelector("[id='shreddit-media-lightbox']");

               if (lightbox.getElementsByTagName('img').length>0) {

                   lightbox5=lightbox.getElementsByTagName('img')[1].src;

                   const lightbox6=lightbox5;

                   var current_page=parseInt(lightbox.getElementsByTagName('zoomable-img')[0].innerText.split("\n")[0].split('/')[0]);
                   var last_page=parseInt(lightbox.getElementsByTagName('zoomable-img')[0].innerText.split("\n")[0].split('/')[1]);

                   if (current_page!=last_page) {

                       var close = document.querySelector("[aria-label='Close lightbox']");
                       close.click();

                       var delayInMilliseconds = 20;
                       setTimeout(function() {
                           var niz_linkova=document.getElementsByClassName('fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center');
                           var niz_slika =[];
                           for (i=0; i<niz_linkova.length; i++ ) {
                               niz_slika[i]=niz_linkova[i].getElementsByTagName('img')[0].src;
                               console.log("niz " + i.toString() + ':  ' + niz_slika[i]);
                           }//end for niz_slika
                           const ind=niz_slika.indexOf(lightbox6);
                           console.log('tekuca slika: ' + lightbox6 + ' index:  ' + ind.toString());

                           var element = document.getElementsByClassName("fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center")[ind+1];
                           element.click();
                       }, delayInMilliseconds);
                   } // end if page
               } //end if length > 0
           }) //end - Right Button Click

            //Right Image Number label

            const right_img_number = document.createElement('label'); // creates the element
            tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(right_img_number);
            right_img_number.style.position = 'absolute'; // position it
            right_img_number.style.right = '15px';
            right_img_number.style.top = '500px';
            right_img_number.innerText=current_page + '/' + last_page;
            //end Image Number label

            //Right Shift Label

            const right_shift = document.createElement('label');
            tagLI[i].getElementsByTagName('zoomable-img')[0].appendChild(right_shift);
            right_shift.style.position = 'absolute';  // position it
            right_shift.style.right = '10px';
            right_shift.style.top = '565px';
            right_shift.innerText='Shift';
            //end Right Shift LabeL


        } //end if //   if was here

    } //end for



    // CTRL KEYPRESS
    function doc_keyCtrl(e) {

        if (e.ctrlKey) {

            var lightbox5;
            const lightbox=document.querySelector("[id='shreddit-media-lightbox']");
            if (lightbox.getElementsByTagName('img').length>0)   {

                lightbox5=lightbox.getElementsByTagName('img')[1].src;
             
                const lightbox6=lightbox5;

                var current_page=parseInt(lightbox.getElementsByTagName('zoomable-img')[0].innerText.split("\n")[0].split('/')[0]);
                if (current_page!=1) {
                    var close = document.querySelector("[aria-label='Close lightbox']");
                    close.click();

                    var delayInMilliseconds = 20;
                    setTimeout(function() {
                        var niz_linkova=document.getElementsByClassName('fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center');
                        var niz_slika =[];

                        for (i=0; i<niz_linkova.length; i++ ) {
                            niz_slika[i]=niz_linkova[i].getElementsByTagName('img')[0].src;
                            console.log("niz " + i.toString() + ':  ' + niz_slika[i]);
                        }// end for

                        const ind=niz_slika.indexOf(lightbox6);
                        var element = document.getElementsByClassName("fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center")[ind-1];
                        element.click();

                    }, delayInMilliseconds);
                } // if  page check
            } // //end if length > 0
        } // end if e.ctrlKey
    }
    //CTRL KEYPRESS END


    // SHIFT KEYPRESS
    function doc_keyShift(e) {

        if (e.shiftKey) {
            var lightbox5;
            const lightbox=document.querySelector("[id='shreddit-media-lightbox']");

            if (lightbox.getElementsByTagName('img').length>0) {

                lightbox5=lightbox.getElementsByTagName('img')[1].src;

                const lightbox6=lightbox5;

                var current_page=parseInt(lightbox.getElementsByTagName('zoomable-img')[0].innerText.split("\n")[0].split('/')[0]);
                var last_page=parseInt(lightbox.getElementsByTagName('zoomable-img')[0].innerText.split("\n")[0].split('/')[1]);

                if (current_page!=last_page) {   //alert('KRAJ');

                    var close = document.querySelector("[aria-label='Close lightbox']");
                    close.click();

                    var delayInMilliseconds = 20;
                    setTimeout(function() {
                        var niz_linkova=document.getElementsByClassName('fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center');
                        var niz_slika =[];
                        for (i=0; i<niz_linkova.length; i++ ) {
                            niz_slika[i]=niz_linkova[i].getElementsByTagName('img')[0].src;
                            console.log("niz " + i.toString() + ':  ' + niz_slika[i]);
                        }//end for niz_slika
                        const ind=niz_slika.indexOf(lightbox6);
                        console.log('tekuca slika: ' + lightbox6 + ' index:  ' + ind.toString());

                        var element = document.getElementsByClassName("fixed left-0 w-100 bottom-0 flex box-border h-full justify-center items-center")[ind+1];
                        element.click();
                    }, delayInMilliseconds);
                } // end if page

            } //end if length > 0

        } // end - if (e.shiftKey)
    }
    //SHIFT KEYPRESS END
  
    // register the handler

    document.addEventListener("keydown",doc_keyShift);
    document.addEventListener("keydown",doc_keyCtrl);

    //Number of subscribers
    if (document.getElementsByTagName('shreddit-subreddit-header').length > 0){
        var subs = parseInt(document.querySelector("#subreddit-right-rail__partial > aside > div > shreddit-subreddit-header").shadowRoot.querySelector("#subscribers > faceplate-number").number);
        document.querySelector("#subreddit-right-rail__partial > aside > div > shreddit-subreddit-header").shadowRoot.querySelector("#subscribers > faceplate-number").innerHTML = subs.toLocaleString();
    }  //end Number of subscribers





    


    //Zoom Plus button
   if (document.querySelectorAll("[id='zoom-plus']").length==0) {

       const zoom_plus=document.createElement('button');
       document.querySelector("[id='reddit-logo']").parentNode.parentNode.appendChild(zoom_plus);
       document.querySelector("[data-part='advertise']").parentNode.appendChild(zoom_plus);
      //   document.querySelector("[data-part='advertise']").parentNode.insertBefore(zoom_plus, document.querySelector("[data-part='advertise']"));
       var att_zp = document.createAttribute("class");
       att_zp.value =" button-bordered button-small button join-btn leading-none min-w-[70px]  ";
       zoom_plus.setAttributeNode(att_zp);
       att_zp=document.createAttribute("id");
       att_zp.value ="zoom-plus";
       zoom_plus.setAttributeNode(att_zp);
       zoom_plus.innerText = 'ZOOM +';
       zoom_plus.style.font = "italic bold 14px arial,serif";
     //  zoom_plus.style.font = "italic bold 16px arial,serif";
       //zoom_plus.innerText = 'Reddit Zoom +';
     //  zoom_plus.style.font = "16px arial,serif";
       //zoom_plus.style.textDecoration = "underline";
       //  zoom_plus.style.color = "#FFFFFF";
       //zoom_plus.style.color = "#BEC3C7";
       //zoom_plus.style.fontWeight = "700";
       zoom_plus.style.position = 'relative';
       zoom_plus.style.left = '2px';
       //zoom_plus.style.right = '10px';
        zoom_plus.style.top = '5px';


       //Zoom Plus Click
       zoom_plus.addEventListener('click', () => {
           alert('All bugs & suggestions please report to u/atlantique_sud \n©2024 Reddit Zoom + v.2.65');
           window.open('https://www.reddit.com/user/atlantique_sud/', '_blank').focus();
       }) //end - Zoom Plus click
   }//end - Zoom Plus if

  // document.querySelector("[data-part='advertise']").remove();  //removing header Advertise button
   //document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#edit-gallery-internal-modal")[1].class='min-h-[auto] max-h-[140vh] max-w-[1400px] w-full';
      // document.querySelector("#post-composer_media").shadowRoot.innnerHTML= document.querySelector("#post-composer_media").shadowRoot.innnerHTML.replace("min-h-[auto] max-h-[80vh] max-w-[800px] w-full" , "min-h-[auto] max-h-[140vh] max-w-[1400px] w-full");
      //  document.querySelector("#post-composer_media").shadowRoot.innnerHTML= document.querySelector("#post-composer_media").shadowRoot.innnerHTML.replace("min-h-[auto] max-h-[80vh] max-w-[800px] w-full" , "min-h-[auto] max-h-[140vh] max-w-[1400px] w-full");
      //  document.querySelector("#post-composer_media").shadowRoot.innnerHTML= document.querySelector("#post-composer_media").shadowRoot.innnerHTML.replace("min-h-[auto] max-h-[80vh] max-w-[800px] w-full" , "min-h-[auto] max-h-[140vh] max-w-[1400px] w-full");
//document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > div.absolute.top-xs.left-xs > div > faceplate-tracker:nth-child(2) > button").addEventListener('click', () => {
  //  alert('click');

//})

//SUBMIT GALLERY GRID
function edit_button(){
//var edit=document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal");
    document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#edit-gallery-internal-modal").setAttribute('class','min-h-[auto] max-h-[140vh] max-w-[1400px] w-full');
    //console.log(document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#edit-gallery-internal-modal").getAttribute('class'));
    if (document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#gallery-container > div").getAttribute('class')!=null){
        document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#gallery-container > div").setAttribute('class','grid grid-cols-5 xs:grid-cols-5 gap-md w-full');
    //console.log( document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#gallery-container > div").getAttribute('class'));
    }
    //const dugme document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > div.absolute.top-xs.left-xs > div > faceplate-tracker:nth-child(2) > button");
//edit.shadowRoot.innerHTML= edit.shadowRoot.innerHTML.replace("max-h-[80vh] max-w-[800px]","max-h-[120vh] max-w-[1200px]");   min-h-[auto] max-h-[120vh] max-w-[1200px] w-full
}

if (window.location.href.includes("submit")) setInterval(edit_button,1000);
//end - SUBMIT GALLERY GRID

//var up=document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > faceplate-carousel > ul");


//SUBMIT FIREFOX FIX
    //SUBMIT
    /*
    //document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > faceplate-carousel > ul > li:nth-child(1) > div > div > img:nth-child(1)")

   // alert(tagUP.length.toString()); // colors.replace("#181C1F;", "#000000;");
    f

    */
    //tagUP[1].shadowRoot.getElementsByTagName('img')[0].class="i18n-post-media-img preview-img media-lightbox-img max-h-[100vw] h-full w-full object-contain relative";
    //  var kk=document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > faceplate-carousel > ul > li:nth-child(1) > div > div > img:nth-child(1)" );
    //  alert(kk.class);
      //document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > faceplate-carousel > ul > li:nth-child(2) > div > div > img:nth-child(1)" ).class="i18n-post-media-img preview-img media-lightbox-img max-h-[100vw] h-full w-full object-contain relative";
      //document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > faceplate-carousel > ul > li:nth-child(3) > div > div > img:nth-child(1)" ).class="i18n-post-media-img preview-img media-lightbox-img max-h-[100vw] h-full w-full object-contain relative";


/* FIREFOX GALLLERY FIX
function submit_ff(){
   // let up=document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper > div > faceplate-carousel > ul");
    let up=document.querySelector("#post-composer_media").shadowRoot.querySelector("#fileInputInnerWrapper");
    if (up.querySelector("#inputInfo")==null) {

        var delayInMilliseconds = 2000;
        setTimeout(function() {
            var tagUP=up.getElementsByTagName('li');
          //  alert ( tagUP.length);
            for (var m=0; m<tagUP.length; m++)
            tagUP[m].innerHTML=tagUP[m].innerHTML.replace("w-full h-full","i18n-post-media-img preview-img media-lightbox-img max-h-[100vw] h-full w-full object-contain relative");
        }, delayInMilliseconds);
    } // else alert ('pics');
}


function check_submit(){
    if (window.location.href.includes("submit/?type=IMAGE")) setInterval(submit_ff, 3000);
}
setInterval(check_submit, 1000);
*/

//alert(document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("#edit-gallery-internal-modal").class); //="min-h-[auto] max-h-[140vh] max-w-[1400px] w-full";
  //  document.querySelector("#post-composer_media").shadowRoot.querySelector("edit-gallery-modal").shadowRoot.querySelector("edit-image-modal").shadowRoot.querySelector("#edit-gallery-internal-modal").class="min-h-[auto] max-h-[140vh] max-w-[1400px] w-full";



//console.log(edit.shadowRoot.innerHTML);

 //setInterval(alert('start'), 5000);
 //end - firefox gallery fiz


});
//end - Mutation Observer

//Mutation Observer options
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
//end - Observer Options

;
