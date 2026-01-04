// ==UserScript==
// @name        Tumblr Always HQ Media
// @description Always load highest resolution version of images on any Tumblr page, not just direct URL
// @version     1.4.0
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @namespace   https://greasyfork.org/en/scripts/32294-tumblr-always-hq-media
// @supportURL http://invertex.xyz
// @match	*://*.tumblr.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32294/Tumblr%20Always%20HQ%20Media.user.js
// @updateURL https://update.greasyfork.org/scripts/32294/Tumblr%20Always%20HQ%20Media.meta.js
// ==/UserScript==
//oldinclude     /^https?://\d+\.media\.tumblr\.com/(.+/)*tumblr_.+_\d+\.(jpe?g|gif|png|bmp)(\?.*)?$/

var sizes = ['_raw.', '_1280.', '_540.', '_500.', '_400.', '_250.', '_100.' ];
var postCount = 0;
var thisJQ = $;

function checkIfJustImgURL(index) {
    if (index >= sizes.length) return;
    var url = window.location.href;
    if(!url.includes("media.")) { return; }
   // url = url.replace(/(.*(?=_))(_\d*.)(.*)/, '$1' + sizes[index] + '$3');
     for (var s = 1; s < sizes.length; s++)
    {
        url = url.replace(sizes[s], sizes[index]); //Replace any size with the max size.
    }
    if(index === 0)
    {
        url = "http://" + url.substring(url.indexOf(".") + 1).replace("media.", "data."); //remove sub-domain number if trying to access RAW image
    }
    if (url == window.location.href) {return;}
    thisJQ.ajax({
        url: url,
        type: 'HEAD',
        complete: function(data, textStatus, jqXHR) {
            window.location.replace(url);
        },
        error: function(jqXHR, textStatus, errorThrown) {
           // console.log(url + " failed to laod");
            checkIfJustImgURL(index + 1);
        }
    });
}
checkIfJustImgURL(0);

function decreaseURL(imgURL)
{
    var newURL = imgURL;

    if(imgURL.includes(".gif"))
    {
         for (var s = 1; s < sizes.length; s++)
         {
             newURL = newURL.replace(sizes[s], "_500."); //Replace any size with the max size.
         }

    }
    else
    {
        for (var s = 1; s < sizes.length; s++)
         {
             newURL = newURL.replace(sizes[s], "_1280."); //Replace any size with the max size.
         }
    }
    return newURL;
}

function processImages(element)
{
    var imgs = element.getElementsByTagName("img");
    
    for (var i = 0; i < imgs.length; i++)
    {
        if(!imgs[i].src.includes("inline")/* && !imgs[i].src.includes(".gif")*/)
        {
            var preSrc = imgs[i].src;
            
            for (var s = 1; s < sizes.length; s++)
            {
                imgs[i].src = imgs[i].src.replace(sizes[s], "_raw."); //Replace any size with the max size.
            }
        
            if(preSrc != imgs[i].src && imgs[i].src.includes(".media."))
            {
                imgs[i].src = "http://" + imgs[i].src.substring(imgs[i].src.indexOf(".") + 1).replace("media.", "data.");

                //Set the link wrapped around our image to point to the same image so as to not confuse people when they hover over it. Or if they do a save link as.
                thisJQ(imgs[i]).attr('data-highres', imgs[i].src);
                var p1 =  thisJQ(imgs[i]).parent();
                var attr = thisJQ(p1).attr('href');

                if(attr == null)
                {
                    p1 = thisJQ(p1).parent();
                }
                p1.attr('href', imgs[i].src);
                imgs[i].setAttribute('oldURL', preSrc);
               /* if(!imgs[i].complete)
                {
                    console.log(imgs[i].src + " failed to load");
                    imgs[i].src = preSrc;
                    thisJQ(imgs[i]).attr('data-highres', preSrc);
                }*/
                imgs[i].onerror = function ()
                {
                    var lowerURL = decreaseURL(this.getAttribute('oldURL'));
                    this.src = lowerURL;
                    thisJQ(imgs[i]).attr('data-highres', lowerURL);
                    thisJQ(this).parent().attr('href', lowerURL);
                };

            }
        }
    }
}

function processVideos()
{
    setTimeout(function()
    {


    var playBars = document.getElementsByClassName("vjs-control-bar");
    var vids = document.getElementsByTagName("video");
    var playButtons = document.getElementsByClassName("vjs-big-play-button");
    var bg = document.getElementsByClassName("vjs-poster");
    
        for(var z = 0; z < playBars.length; z++)
        {
            playBars[z].innerHTML += "<a href='http://google.com' class='vjs-menu-button vjs-control'>©</a>";
        }
        
    for(var b = 0; b < bg.length; b++)
    {
        bg[b].outerHTML = "";
    }
        for(var c = 0; c < playButtons.length; c++)
    {
        playButtons[c].setAttribute("style", "margin-top: 200px;");
    }
    for (var i = 0; i < vids.length; i++)
    {
        var source = vids[i].getElementsByTagName("source")[0];
        if(source.src.slice(-4) === "/480")
        {
            source.src = source.src.slice(0, -4);
        }
        vids[i].load();
       // playButtons[i].setAttribute("style", "margin-top: 100px;");
        
        //thisJQ(bg[i]).wrap('<a href="http://google.ca"></a>');
        
       // processVideoUI(vids[i]);
    }
            }, 1000);
}

function processVideoUI(videoElem)
{
    var parent = videoElem.parentElement;
    
    parent.getElementsByClassName("vjs-big-play-button")[0].setAttribute("style", "margin-top: 100px;");
    var bg = parent.getElementsByClassName("vjs-poster")[0];
    var wrapper = document.createElement("a");
    parent.appendChild(wrapper);
    wrapper.appendChild(bg);
    
    
}

function updatePageLinks(waitTime)
{
    
    setTimeout(function()
    {
        var lightBox = document.getElementsByClassName("tmblr-lightbox");

        processVideos();

        if(lightBox.length > 0)
        {
            console.log("lightbox active");
            processImages(lightBox[0]);
            thisJQ(lightBox[0]).on('click', function(){processImages(lightBox[0]);}); //Watch for lightbox click to update URLs again since they will be refreshed by tumblr back to lower res
        }
            processImages(document.body);

            var photosets = document.body.getElementsByTagName("iframe");
            for(var i = 0; i < photosets.length; i++)
            {
                processImages(photosets[i].contentWindow.document);
            }

        console.log("end change");
    }, waitTime);
}

function doSetup(){
       updatePageLinks(0);

    setTimeout(function() //Experimenting with dashboard scroll updating, but ran into cross-domain issues. Don't really need to resize dashboard previews anyways, still resizes when you click on them to expand or new page.
    {
       // window.jQ = thisJQ;
        var newPosts = document.getElementsByClassName('posts');
        if(newPosts.length > 0)
        {
            newPosts = document.getElementsByClassName('grid');
        }


        if(newPosts.length > 0)
        {
            $(newPosts[0]).bind('DOMSubtreeModified', function()
            {
                var childCnt = 0;
                childCnt = newPosts[0].children.length;
               // if(childCnt > postCount)
               // {
                    postCount = childCnt;
                    //processVideos();
                   // processImages();
                console.log("children changed");
                   updatePageLinks(0);
              //  }

            });
        }
        var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
        console.log("start change");
        updatePageLinks(500);
    });
});
observer.observe(document.body, {attributes: true, attributeFilter: ['style', 'class']});
    var grid = document.getElementsByClassName('grid');
    if(grid != null && grid.length > 0){
        observer.observe(grid[0], {attributes: true, attributeFilter: ['style', 'class']});
         console.log("grid watch");
    }
    var posts = document.getElementsByClassName('posts');
    if(posts != null && posts.length > 0){
        observer.observe(posts[0], {attributes: true, childList: true});
         console.log("post watch");
    } 
   var posts2 = document.getElementById('posts');
        if(posts2 != null){
           observer.observe(posts2, {attributes: true, childList: true});
         console.log("post watch"); 
        }
        
        
    }, 2000);

     
}

thisJQ(document).ready(function(){
     doSetup();

});

function checkLightbox(){
    setTimeout(function(){
     var lightBox = document.getElementById("tumblr_lightbox");

console.log("lightbox check");
        if(lightBox != null)
        {
            console.log("lightbox active");
            processImages(lightBox);
            //lightBox.onclick = checkLightbox;
           thisJQ(lightBox).on('click', function(){processImages(lightBox);}); //Watch for lightbox click to update URLs again since they will be refreshed by tumblr back to lower res
        }
       //  updatePageLinks(0);
    }, 200);
}
document.onclick = checkLightbox;

$.noConflict();