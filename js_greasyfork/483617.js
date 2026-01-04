// ==UserScript==
// @name          Secret MindTech - Personal Use Plugin
// @namespace     Secret MindTech
// @description   Infinite scroll for job feed. Scroll up and scroll donw buttons. Reveal real number of applicants for a job.
// @grant         none
// @include       /^https?://www\.upwork\.com/.*$/
// @require       https://code.jquery.com/jquery-2.2.4.min.js
// @author        Preet Patel
// @version 0.0.2.20161026195722
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/483617/Secret%20MindTech%20-%20Personal%20Use%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/483617/Secret%20MindTech%20-%20Personal%20Use%20Plugin.meta.js
// ==/UserScript==

if (window != window.top) {
  /* I'm in a frame! */
  return;
}

// Call the scrollToTop function to scroll to the top
$(document).ready(function () {
  const roomBodyElement = document.querySelector(".scroll-wrapper");
  const chatData = [];
  function hasMoreContent() {
    // Implement your logic to check if there is more content to load
    // For example, check if there is a "Load more" button or if the element is still scrollable
    // Return true if there is more content, otherwise return false
  }

  // Function to scroll the "room-body" element to the top
  function scrollToTopWithinRoomBody() {
    roomBodyElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Function to scroll within "room-body" until all content is loaded
  function scrollUntilAllContentLoaded() {
    // Scroll to the top initially
    scrollToTopWithinRoomBody();

    // Scroll until all content is loaded
    function scrollUntilLoaded() {
      if (hasMoreContent()) {
        roomBodyElement.scrollTop += 100; // Adjust the scrolling amount as needed
        setTimeout(scrollUntilLoaded, 500); // Adjust the timeout as needed
      } else {
        // All content loaded, log the content
        chatData.push(roomBodyElement.textContent.trim());
      }
    }

    // Start scrolling
    scrollUntilLoaded();
  }

  async function callApi(chatData) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      "Bearer sk-eNmdjIZMJPSNdi0zYSFNT3BlbkFJ6pba0T1Tk1e2P1qq7b3"
    );
    myHeaders.append(
      "Cookie",
      "__cf_bm=n5nikmqwZHaJZhPdlpp6YOw_W.MS3j8uBBUew_vyV5A-1704106717-1-ATh3AcH81+LhdJCLgr2gWOHFnvg7crSjg+DpG26lrdiTsCK01t6djWbeqNVQPkR1Px6AsceHCsLCOW9gLK9WIr4=; _cfuvid=xolwxSgSsVPYPlcJlSZOAJR_aDZlcupAEdoLV8s31fs-1704106717014-0-604800000; __cf_bm=jIX7KVQj.dIhTlv8ekk92Zo4XFDxw3TodVopEz6scag-1704109610-1-Ad74Kzer1eduCvZoqJtCApQ2hk12yszHHwQTiwp+zH5JYW5SRAeNGPtgfDXlT8G7MD68vdRCWIn6bqxJFyGDkOM=; _cfuvid=w008BJQ.JEg3GSQRX71znv6qWS.7Ct7r5HVdZIZUxlQ-1704109610345-0-604800000"
    );
console.log(123)
    var raw = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: JSON.stringify(chatData),
        },
      ],
    });
console.log(456)
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
console.log(789)
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      requestOptions
    );
    // .then(response => response.text())
    // .then(result => console.log(result))
    // .catch(error => console.log('error', error));
    return response.json();
  }

  // Delay the execution of the scraping script for 5 seconds
  setTimeout(async () => {
    // Call the function to scroll within "room-body" until all content is loaded
    scrollUntilAllContentLoaded();
    console.log(chatData);
    const reply = await callApi(`My name is Preet Patel, what should i reply?. Generate reply or followup message in max 50 words and without subject and any footer messages. "${chatData}"`)
    console.log(reply)

    // reply = "Hello, Thanks for your message.";
    const proseMirrorElement = document.querySelector(".ProseMirror");

    // Create a new paragraph element
    const paragraphElement = document.createElement("p");

    console.log(reply.choices)
    // Set the content of the paragraph element
    paragraphElement.innerHTML = reply.choices[0].message.content;

    // Append the paragraph element to the "ProseMirror" element
    proseMirrorElement.appendChild(paragraphElement);
  }, 2000); // 5000 milliseconds (5 seconds)
});
