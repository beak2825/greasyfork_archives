// ==UserScript==
// @name        Recommendations history
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/
// @grant       none
// @version     1.0
// @author      mrsnowman
// @description 2022-06-29, 09:18:35
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/447224/Recommendations%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/447224/Recommendations%20history.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    var video_recommendations = []
    var old_length = 0
    var update_queue_time=0

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        
        // Change this to div.childNodes to support multiple top-level nodes.
        return div.firstChild;
    }

    function queue_update() {
        var mutation_cooldown = 1000 // Just avoid running add_to_list unecessarily much, 1 second cooldown between updates
        if (update_queue_time < (Date.now() - mutation_cooldown)){
            update_queue_time=Date.now()
            setTimeout(add_to_list, 500); //small delay to allow page updates to have happened.
        }
    }
    function add_to_list() {
        if (video_recommendations.length == 0){
            if (localStorage.getItem("video_list")){
              try{
                video_recommendations = JSON.parse(localStorage.getItem("video_list")) 
              }
              catch(error){
                // Reset list if there's an error
                console.log("Video list reset!")
                localStorage.setItem("video_list", JSON.stringify(video_recommendations)) 
                video_recommendations=[]  
              }
            }
        }
  
        if (video_recommendations.length > 200){
            let count_to_remove = video_recommendations.length - 200
            video_recommendations.splice(0, count_to_remove)
        }
  
        var recommendations = document.querySelectorAll("#dismissible.ytd-rich-grid-media")
        if (recommendations.length == old_length) {
            return
        }
        old_length = recommendations.length
        for (let i = recommendations.length-1; 0 <= i ; i--){
            let video=recommendations[i];
            let thumbnail_url = video.querySelector("img").src
            let video_title = video.querySelector("yt-formatted-string").innerText
            let video_url = video.querySelector("a#thumbnail").href
            console.log(thumbnail_url)
            let timestamp = Date.now()
            video_recommendations.push({'title':video_title, 'thumb_url':thumbnail_url, 'time':timestamp, 'video_url':video_url})
        }    
        console.log(video_recommendations)
        console.log(recommendations)
        localStorage.setItem("video_list", JSON.stringify(video_recommendations)) 
    }
  
    var mutation_observer = new MutationObserver(queue_update)
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      }
    mutation_observer.observe(document, observerOptions);
  
    // Add button
    function add_recommended_history_button() {
        // Dumb hack to make sure it's loaded.
        let sidepanel_buttons = document.querySelectorAll("#endpoint")
        if (sidepanel_buttons.length == 0){
            // Try again later
            setTimeout(add_recommended_history_button, 300)
            return
        }

        console.log(sidepanel_buttons)
        let last_button = sidepanel_buttons[sidepanel_buttons.length-1]
        var html='<div style=" z-index:9001;background-color:#777;position:fixed;bottom:50px;left:30px"><span style="margin-left:20px; height:25px; width:25px; background-color:#bbb; border-radius: 50%; display:inline-block"></span><span style="color: #ccc; text-align:center">Recommended History</span></div>'
        
        var my_button = createElementFromHTML(html)
        my_button.addEventListener('click', toggle_history)
        document.body.appendChild(my_button)
  
  
    }
    add_recommended_history_button() 
    function make_video_display(data){
        let html= '<a href="https://www.google.com" style="max-width:200px;width: 100px;display: flex;flex-direction: column; margin:10px"><img src="https://i.ytimg.com/vi/rvnbhmLAwY4/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&amp;rs=AOn4CLDDXDD6j0eNfWNh6bcdGhyFTFkkHg" style="width: 200px;height: auto;"><p style="width: 100%;">Tidle kinda long title</p></a>'
        let video_template = createElementFromHTML(html)
        video_template.href=data['video_url']
        video_template.querySelector("img").src=data['thumb_url']
        video_template.querySelector("p").innerHTML=data['title']        
        return video_template
    }
    function toggle_history(){
        if (document.querySelector("#history_list")){
            let list=document.querySelector("#history_list")
            list.remove(list)
            return
        }
        console.log("Displaying history!")
        let video_recommendations = JSON.parse(localStorage.getItem("video_list")) 

        let history_list = createElementFromHTML('<div id="history_list" style="overflow-y:scroll; position:fixed; top:50px; right: 50px; width:1000px; height:600px; background-color: #5a5; min-height:200px; z-index:9001"><div id="flex_container" style="display:flex; flex-wrap:wrap"></div>')
        for (let i = video_recommendations.length-1; 0 < i; i--){
            let data = video_recommendations[i]
            let flex_container = history_list.querySelector("#flex_container")
            let video_element = make_video_display(data)
            flex_container.appendChild(video_element)
        }
        document.body.appendChild(history_list)
        }
  }, false);



  