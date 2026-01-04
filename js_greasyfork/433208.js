// ==UserScript==
// @name        阅读悦小说,在线收听,自动下一页
// @namespace   Violentmonkey Scripts
// @match        *://www.yuedyue.com/*
// @grant       none
// @version     1.2
// @author      白嫖党
// @description 2021-09-30 16:09:45
// @icon         data:image/jpeg;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABMLAAATCwAAAAAAAAAAAAAAAAAAprEHAKaxB0KmsQflprEHpKaxBxemsQeJprEH1qaxB4imsQcWprEHAqaxB2amsQfqprEH/6axB76msQcmprEHAKaxBwCmsQeAprEH/6axB+emsQd0prEH6KaxB/+msQf6prEHe6axByqmsQfbprEH/6axB/+msQf6prEHdKaxBwCmsQcAprEHhqaxB/+msQfwprEHhqaxB+imsQf/prEH/6axB7emsQdgprEH9KaxB/+msQf/prEH/6axB4gAAAAAprEHAKaxB3WmsQf/prEH7qaxB0imsQeSprEH/KaxB/+msQfHprEHb6axB/emsQf+prEH0KaxB6imsQc4AAAAAKaxBwCmsQdTprEH96axB+amsQcfprEHFaaxB7imsQf/prEH3KaxB3CmsQfzprEH+KaxB2SmsQcHprEHAaaxBw6msQdTprEHS6axB+umsQfyprEHRKaxBwqmsQevprEH/6axB/imsQfcprEH/KaxB/+msQfIprEHL6axBwCmsQdLprEH46axB32msQfgprEH/6axB4amsQdhprEH9aaxB/+msQf/prEH/6axB/+msQf/prEH/6axB7GmsQcRprEHb6axB/umsQehprEH0qaxB/+msQe8prEHs6axB/+msQf/prEH+KaxB+imsQfuprEH/aaxB/+msQfsprEHQqaxB3KmsQf8prEHrqaxB8ymsQf/prEHvKaxB7qmsQf/prEH/6axB6KmsQcjprEHQKaxB9OmsQf/prEH8aaxB1WmsQdvprEH+6axB5+msQfIprEH/qaxB3WmsQefprEH/6axB/+msQfMprEHb6axB3imsQfhprEH/6axB+ymsQdFprEHQ6axB9OmsQdrprEH0aaxB/emsQdOprEHS6axB+emsQf/prEH/6axB/2msQf9prEH/6axB/+msQerprEHD6axBwimsQcnprEHJaaxB+OmsQf/prEHa6axBwCmsQdJprEHq6axB8qmsQfqprEH/qaxB/+msQf/prEHdqaxBwAAAAAAprEHAKaxBxymsQfjprEH/6axB36msQcWprEHiKaxB8SmsQenprEHZaaxB9umsQf/prEH/6axB7WmsQcPAAAAAKaxBwCmsQcZprEH3KaxB/+msQdoprEHUaaxB/amsQf/prEH+aaxB2emsQeZprEH/6axB/+msQe2prEHDwAAAACmsQcAprEHBqaxB3WmsQedprEHH6axBxumsQeKprEHr6axB5SmsQcjprEHMKaxB6mmsQetprEHQqaxBwAAAAAAAAAAAKaxBwCmsQcHprEHCaaxBwCmsQcAprEHBaaxBwymsQcGprEHAKaxBwGmsQcMprEHDKaxBwGmsQcAwAAAAMAAAADAAAAAwAAAAMAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAQAAwAAAAMAAAADAAQAA5iEAAA==
// @downloadURL https://update.greasyfork.org/scripts/433208/%E9%98%85%E8%AF%BB%E6%82%A6%E5%B0%8F%E8%AF%B4%2C%E5%9C%A8%E7%BA%BF%E6%94%B6%E5%90%AC%2C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/433208/%E9%98%85%E8%AF%BB%E6%82%A6%E5%B0%8F%E8%AF%B4%2C%E5%9C%A8%E7%BA%BF%E6%94%B6%E5%90%AC%2C%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==
(function () {
  'use strict';
  
  var audiomp3 = document.getElementsByTagName("audio")[0]
  if (audiomp3){
    var statusclock = setInterval(status,1000)
    var intclock = setInterval(clock,1000 * 10)

    function status(){
      if (audiomp3.readyState){
        audiomp3.playbackRate = 1.25
        audiomp3.play()
        window.clearInterval(statusclock)
      }
    }

    function clock(){
      console.log(audiomp3.currentTime)
      console.log(audiomp3.duration)
      audiomp3.playbackRate = 1.25
      if (audiomp3.duration == audiomp3.currentTime){
        var read_dwn = document.getElementsByClassName("read_dwn")[0].children[0].childNodes[3]
        read_dwn.click()
      }
    }
  }
  
  
  
})()