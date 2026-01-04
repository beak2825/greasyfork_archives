// ==UserScript==
// @name         Nat.dev Chat Downloader
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Download chat content as Markdown
// @author       gpt-4
// @match        https://nat.dev/chat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475111/Natdev%20Chat%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/475111/Natdev%20Chat%20Downloader.meta.js
// ==/UserScript==

(async function () {
  const fetchChats = async () => {
    const response = await fetch("https://nat.dev/api/completion/chat");
    const chats = await response.json();
    return chats;
  };

  const fetchChatContent = async (id) => {
    const response = await fetch(`https://nat.dev/api/completion/chat/${id}`);
    const chatContent = await response.json();
    return chatContent;
  };

  const createFloatingWindow = (chats) => {
    const floatWindow = document.createElement("div");
    floatWindow.style.position = "fixed";
    floatWindow.style.top = "50%";
    floatWindow.style.left = "50%";
    floatWindow.style.transform = "translate(-50%, -50%)";
    floatWindow.style.backgroundColor = "white";
    floatWindow.style.border = "1px solid black";
    floatWindow.style.padding = "10px";
    floatWindow.style.zIndex = "1000";
    floatWindow.style.width = "75%";
    floatWindow.style.height = "75%";
    floatWindow.style.overflowY = "scroll";
    floatWindow.innerHTML = "<h3>Select a chat to download:</h3>";

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(floatWindow);
    });
    floatWindow.appendChild(closeButton);

    chats.forEach((chat, index) => {
      const chatItem = document.createElement("div");
      const truncatedDescription = `${index + 1}. ${chat.description.slice(0, 15)}...`;
      chatItem.textContent = truncatedDescription;
      chatItem.style.cursor = "pointer";
      chatItem.style.marginBottom = "5px";

      chatItem.addEventListener("click", async () => {
        const chatContent = await fetchChatContent(chat.id);
        const markdownContent = generateMarkdown(chatContent);
        downloadMarkdown(markdownContent, `chat-${chat.id}.md`);
      });

      floatWindow.appendChild(chatItem);
    });

    document.body.appendChild(floatWindow);
  };

  const generateMarkdown = (chatContent) => {
    const systemContext = chatContent.meta.systemContext;
    let markdownContent = `System Context: ${systemContext}\n\n`;

    const processLinks = (linkId) => {
      const link = chatContent.links[linkId];
      const completion = link.completion;
      const author = completion.author.name;
      const content = completion.content;
      markdownContent += `Author: ${author}\n\nContent:\n${content}\n\n`;

      if (link.links.length > 0) {
        link.links.forEach((childLinkId) => {
          processLinks(childLinkId);
        });
      }
    };

    chatContent.startLinks.forEach((linkId) => {
      processLinks(linkId);
    });

    return markdownContent;
  };

  const downloadMarkdown = (markdownContent, fileName) => {
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download Chat";
  downloadButton.style.position = "fixed";
  downloadButton.style.bottom = "10px";
  downloadButton.style.right = "10px";
  downloadButton.style.zIndex = "1000";
  downloadButton.addEventListener("click", async () => {
    const chats = await fetchChats();
    createFloatingWindow(chats);
  });
  document.body.appendChild(downloadButton);
})();
