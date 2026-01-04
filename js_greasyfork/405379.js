

    // ==UserScript==
    // @name     Tapas.io RSS Button
    // @description Adds RSS buttons to webcomics on tapas.io.
    // @author Alex V.H.
    // @namespace https://avhn.us/
    // @version  2.05
    // @license  CC0-1.0
    // Copyright: the embedded RSS icon and the script's icon are both derived from assets from tapas.io
    // I believe that their use in this script is okay, since the RSS icon is generic and universal,
    // and both the tapas logo and their RSS sprite have been transformed from the original.
    // @supportURL https://forums.tapas.io/t/rss-feeds-gone/41724
    // @icon https://archive.org/download/tapas-rss-icon/tapas-rss.gif
    // @compatible firefox browser used for development by author
    // @compatible chrome briefly tested by author
    // @match https://tapas.io/series/*
    // @match https://tapas.io/episode/*
    // @match https://m.tapas.io/series/*
    // @match https://m.tapas.io/episode/*
    // @grant    none
// @downloadURL https://update.greasyfork.org/scripts/405379/Tapasio%20RSS%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/405379/Tapasio%20RSS%20Button.meta.js
    // ==/UserScript==
     
    const rssIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfkBg8CGwrcReAoAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAPxJREFUKM99kD9LwgEURc/PQJAQIwkqopaawm/Q3lI0Orrkx2hxaXBrdQmsJmlJ6CsU9IegKQoiSgIriginOg2+zCy643uHd+99ic8M80iLa/bZS+4ZlP36sGnhP0D13ZqZ733iIi+MMskCS+RjesJKcvvbbMiSN3Hnzin+khnrgRyHkWtuWLForgdVAqn9DNmxajaQesQtDLY4dzqMulmagIdue2Cnh2QBLMVfxr98x2wEUo1GD6qW+xs0IksOwE1VdzFxznRc6RoVAVxV9TTFFhccmYakzRkA8wC0AJhIsQwUmAHgCoARAJ4AyKdY55UdLgGYBaANQPdxb589AOJXV9GZEgAAAABJRU5ErkJggg==";
     
    // tapas.io webcomic series all have a unique ID: a few-digit (4-ish?) base-10 number.
    // The ID is needed to construct the RSS URL.
    // Fortunately, there are a couple of places to find the ID.
    // The following functions return the ID, or -1 if they fail to find it.
     
    function findIDfromMetas(){
      // tapas.io sends a great deal of meta tags in their pages.
      // Many of these tags are to allow different mobile apps to get to the same page.
      // These tags have the format "tapastic://series/id[/episode/N]".
    	const tapastic_regex = new RegExp("tapastic:\/\/series\/[0-9]+");
    	const id_regex = new RegExp("[0-9]+");
      const metas = document.getElementsByTagName('meta');
      console.log(metas);
      for (let i=0; i<metas.length; i++){
        let meta = metas[i];
        let content = meta.getAttribute("content");
        if (tapastic_regex.test(content)) {
          console.log("Found a series ID in", meta);
          //let id=content.match("[0-9]+")[0];
          let id = id_regex.exec(content)[0];
          return id;
        }
      }
      console.log("Couldn't find a meta tag with the series ID!");
    	return -1;
    }
     
    function findIDfromSubscribers(){
      // Get the js-subscribe-cnt classed elements, they have an href with the series ID.
      // In a browser, you can see the URL (and ID) by hovering over the subscriber count in the info page.
      let jscs = document.getElementsByClassName("js-subscribe-cnt");
      if (jscs.length < 1) {console.log("No place to get series id!"); return -1;}
      jsc = jscs[0];
      console.log(jsc.href);
      if (jscs.length > 1) {console.log("More than one \"js-subscribe-cnt\"s found. Using the first one and ignoring the rest.");}
      let numbers = jsc.href.match("[0-9]+"); // regex: a series of one or more digits
      if (numbers.length < 1) {console.log("No series ID found! Searched this string for the ID, a base-10 number:", jsc.href); return -1;}
      console.log("Found a series ID in", jsc);
      let id = numbers[0];
      if (numbers.length > 1) {console.log("More than one base-10 number found where ID should be! Using the first one and ignoring the rest.");}
      return id;
    }
     
    function findID(){
      let id = findIDfromMetas();
      if (id == -1){
        id = findIDfromSubscribers();
        if (id == -1){
          console.log("Tried everything but couldn't find series ID! Script is broken!");
          console.log("Please file a bug at https://forums.tapas.io/t/rss-feeds-gone/41724 and ping the author!");
        }
      }
      return id;
    }
     
    function rssURL(id){
      return "https://tapas.io/rss/series/" + id;
    }
     
    function addRSSButtons(id){
      if (id < 0){return;}
      
      // There are 4 places to add an RSS button:
      
      // In the Button Wrapper in series-root__footer (visible on the mobile website)
      let srfs = document.getElementsByClassName("series-root__footer");
      console.log(srfs);
      if (srfs.length > 0){
        console.log("There is a series root footer. Looking for its button-wrapper.");
        let srf = srfs[0];
        let bws = srf.getElementsByClassName("button-wrapper");
        console.log(bws);
        if (bws.length > 0){
          console.log("There is a button-wrapper in the series root footer.");
          let bw = bws[0];
          let rbs = bw.getElementsByClassName("button-rss");
          if (rbs.length > 0) {
            console.log("This button-wrapper already has an RSS button. Not adding another one.");
          } else {
            console.log("Adding an RSS button to the series root footer's button-wrapper.");
            let img = document.createElement("img");
            img.style = "filter: invert(100%)";
            img.alt = "RSS Icon";
            img.src = rssIcon;
            let btn = document.createElement("a");
            btn.className = "button button--subscribe button-rss";
            btn.href = rssURL(id);
            btn.appendChild(img);
            bw.appendChild(btn);
            console.log("Button added to", bw);
          }
        }
      }
      
      // In the Button Wrapper in section__top
      let sts = document.getElementsByClassName("section__top");
      console.log(sts);
      if (sts.length > 0){
        // There are 2 section__top elements. One of them is section__top--simple. Don't put a button on it.
        // The other is just section__top. It (and not section__top--simple) has a button-wrapper. Do put a button in there.
        let st;
        for(let i=0; i<sts.length; i++){
          let st = sts[i];
          let bws = st.getElementsByClassName("button-wrapper");
          if (bws.length > 0){
            console.log(st, "has a button-wrapper.");
            let bw = bws[0];
            let rbs = bw.getElementsByClassName("button-rss");
            if (rbs.length > 0){
              console.log("This button-wrapper already has an RSS button. Not adding another one.");
            } else {
              console.log("Adding an RSS button to this section__top's button-wrapper.");
              let img = document.createElement("img");
              img.alt = "RSS Icon";
              img.src = rssIcon;
              let btn = document.createElement("a");
              btn.className = "button button--read button-rss";
              // This particular button needs to be re-styled.
              btn.style = "min-width: 16px; padding: 12px 12px; margin-left: 6px;"
              btn.href = rssURL(id);
              btn.appendChild(img);
              bw.appendChild(btn);
              console.log("Button added to", bw);
            }
          }
        }
      }
      
      // In the center of the Toolbar at the bottom of the comic browser
      let trcs = document.getElementsByClassName("toolbar__row--center");
      if (trcs.length > 0){
      	console.log(trcs);
        let trc = trcs[0];
        let ris = trc.getElementsByClassName("row-item");
        console.log(ris);
        if (ris.length > 0){
          let ri = ris[0];
          let rbs = ri.getElementsByClassName("button-rss");
          if (rbs.length > 0){
            console.log("This row-item alreads has an RSS button. Not adding another one.");
          } else {
            console.log("Adding an RSS button to this toolbar__row--center's row-item.");
            let a = document.createElement("a");
            a.className = "toolbar-btn button-rss";
            a.href = rssURL(id);
            let div = document.createElement("div");
            div.className = "ico-wrap";
            let img = document.createElement("img");
            img.class = "ico";
            img.style = "margin: auto;";
            img.alt = "RSS Icon";
            img.src = rssIcon;
            div.appendChild(img);
            let span = document.createElement("span");
            let text = document.createTextNode("RSS");
            span.appendChild(text);
            a.appendChild(div);
            a.appendChild(span);
            ri.appendChild(a);
            console.log("Button added to", ri);
          }
        }
      }
      
      // In the Dropdown List in the tpFloatMenu (on the mobile website)
      let tfm = document.getElementById("tpFloatMenu");
      if (tfm != null){
        console.log("Found a tpFloatMenu:", tfm);
        if (tfm.text.indexOf("button\-rss") > -1){
          console.log("The tpFloatMenu already contains an RSS button. Not adding another one.");
        } else {
          // tpFloatMenu is a script tag with a text node.
          // The text node contains the HTML that goes into the menu:
          //   a <div> containing a <ul>, which contains a few <li>s.
          // We want to insert a new <li> after the first <li>.
          console.log(tfm.text);
          let lis = tfm.text.split("\<\/li\>");
          lis.splice(1,0,"\n <li class=\"dropdown-list__item\"> <a href=\"https://tapas.io/rss/series/" + id + "\" class=\"dropdown-list__button button-rss\"\> <span class=\"ico-wrapper\"><i class=\"ico\"> <img src=\"" + rssIcon + "\"> </i></span>RSS Feed</a>")
          tfm.text = lis.join("</li>");
          console.log(tfm.text);
        }
      }
    }
     
    function addLink(id){
      let ls = document.head.getElementsByTagName("link");
      for (let i=0; i<ls.length; i++){
        let l = ls[i];
        if (l.type == "application/rss+xml"){
          if (l.href == rssURL(id)){
            console.log("This page's head already has a link tag for the RSS feed. Not adding another one.");
            return;
          }
        }
      }
      let l = document.createElement("link");
      l.rel = "alternate";
      l.type = "application/rss+xml";
      l.title = "RSS Feed";
      l.href = rssURL(id);
      document.head.appendChild(l);
      console.log("Added link tag to head:", l);
    }
     
    function addButtons(){
      let id = findID();
      if (id < 0) {return;}
      addRSSButtons(id);
      addLink(id);
    }
     
    // Tapas has a website feature where,
    // if while reading a comic you click on the "more..." in the description in the top-right,
    // the comic's info page loads and is overlaid over the episode page.
    // This changes the window URL and loads a bunch of new content,
    // which needs an RSS button added.
    // But since the overlaid info page is loaded and rendered after the page load,
    // the script will not have added an RSS button to it.
    // But because the window URL has changed,
    // if you click the "more..." link and then refresh the page,
    // the RSS button will be added to the info page!
    // The script also works fine if you navigate directly to the info page.
    // To get around this post-page-load content-and-URL-change,
    // the script detects clicks on the "more..." link,
    // waits 2 seconds to give time for the overlaid info page to load,
    // and then adds the RSS button.
    function delayAddButtons(){window.setTimeout(addButtons, 2000);}
    let mlbs = document.getElementsByClassName("more-less-btn");
    console.log(mlbs.length);
    if (mlbs.length > 0) {
      mlb = mlbs[0];
      console.log("Adding callback to more-less-button:", mlb);
      mlb.addEventListener("click", delayAddButtons);
    }
     
    // Do the thing!
    addButtons();
     

