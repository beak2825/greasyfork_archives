// ==UserScript==
// @name        2ch gacha auto redirect
// @namespace   Violentmonkey Scripts
// @match       https://2ch.hk/gacha/*
// @grant       none
// @version     1.0
// @author      rainyday
// @description 2024-12-01
// @downloadURL https://update.greasyfork.org/scripts/519484/2ch%20gacha%20auto%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/519484/2ch%20gacha%20auto%20redirect.meta.js
// ==/UserScript==

// snippets/watch-thread-ai.ts
var configuration = {
  boardName: "gacha",
  threadMatchers: ["Wuthering Waves", "/ww/"],
  slowInterval: 5000,
  fastInterval: 1000,
  nextThreadCheckInterval: 800
};
if (document.title.includes("Genshin Impact")) {
  configuration.threadMatchers = ["Genshin Impact", "/genshin/"];
}
Object.freeze(configuration);
var checkThreadMatch = (threadSubject) => configuration.threadMatchers.some((threadMatcher) => threadSubject.includes(threadMatcher));
if (checkThreadMatch(document.title)) {
  let stopWatching = undefined;
  const initUI = (toggleWatcher) => {
    const watcherContainer = document.createElement("span");
    watcherContainer.style.display = "inline-block";
    watcherContainer.setAttribute("id", "watch-thread");
    const toggleCheckbox = document.createElement("input");
    toggleCheckbox.setAttribute("id", "watch-thread-toggle");
    toggleCheckbox.setAttribute("type", "checkbox");
    watcherContainer.appendChild(toggleCheckbox);
    const label = document.createTextNode(" Auto-redirect to next thread ");
    watcherContainer.appendChild(label);
    const refreshTimeDisplay = document.createElement("span");
    watcherContainer.appendChild(refreshTimeDisplay);
    const ref = document.querySelector("div.tn__item:nth-child(1) > span:nth-child(5)");
    if (ref && ref.parentNode) {
      ref.parentNode.insertBefore(watcherContainer, ref);
      ref.parentNode.insertBefore(document.createTextNode(" "), ref);
    } else {
      console.error("Could not find UI element to attach watcher.");
    }
    toggleCheckbox.addEventListener("change", async () => {
      await toggleWatcher(toggleCheckbox.checked);
    });
  };
  initUI(async (isEnabled) => {
    if (isEnabled) {
      stopWatching = await startThreadWatcher();
    } else {
      if (stopWatching) {
        stopWatching();
        stopWatching = undefined;
      } else {
        console.error("Trying to disable thread watcher, but it is not running.");
      }
    }
  });
}
var startThreadWatcher = async () => {
  const getThreads = async (boardName) => {
    try {
      const response = await fetch(`https://2ch.hk/${boardName}/catalog.json`);
      const json = await response.json();
      return json.threads.map((thread) => ({
        id: thread.num,
        subject: thread.subject,
        posts_count: thread.posts_count
      }));
    } catch (error) {
      console.error("Error fetching threads:", error);
      return [];
    }
  };
  const getPostsCount = async (boardName, threadId) => {
    try {
      const response = await fetch(`https://2ch.hk/api/mobile/v2/info/${boardName}/${threadId}`);
      const json = await response.json();
      return json.thread.posts;
    } catch (error) {
      console.error("Error fetching post count:", error);
      return -1;
    }
  };
  const extractThreadNumber = (threadSubject) => {
    const match = threadSubject.match(/\d+/);
    return match ? parseInt(match[0]) : -1;
  };
  const redirectToNewThread = (thread) => {
    console.log(`Redirecting to new thread: ${JSON.stringify(thread)}`);
    if (typeof window !== undefined) {
      window.location.href = `https://2ch.hk/${configuration.boardName}/res/${thread.id}.html`;
    }
  };
  const getLatestMatchingThread = async () => {
    try {
      const threads = await getThreads(configuration.boardName);
      return threads.filter((thread) => checkThreadMatch(thread.subject)).sort((a, b) => extractThreadNumber(b.subject) - extractThreadNumber(a.subject))?.[0];
    } catch (error) {
      console.error("Error getting latest thread:", error);
      return;
    }
  };
  let currentThread = await getLatestMatchingThread();
  let searchingForNextThread = false;
  let keepWatching = true;
  const watcherLoop = async () => {
    while (keepWatching) {
      const checkInterval = searchingForNextThread ? configuration.nextThreadCheckInterval : currentThread?.posts_count && currentThread.posts_count > 980 ? configuration.fastInterval : configuration.slowInterval;
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
      if (!searchingForNextThread && currentThread) {
        try {
          const postsCount = await getPostsCount(configuration.boardName, currentThread.id);
          if (postsCount > 999) {
            searchingForNextThread = true;
            console.log(`Post limit reached in ${currentThread.subject}, searching for the next thread.`);
          } else {
            currentThread.posts_count = postsCount;
            console.log(`Current thread ${currentThread.subject} has ${postsCount} posts.`);
          }
        } catch (error) {
          console.error("Error in main loop:", error);
        }
      }
      if (searchingForNextThread) {
        const nextThread = await getLatestMatchingThread();
        if (nextThread && nextThread.id !== currentThread?.id) {
          currentThread = nextThread;
          redirectToNewThread(currentThread);
        } else {
          console.log("Next thread not found yet.");
        }
      }
    }
  };
  watcherLoop();
  return () => {
    keepWatching = false;
  };
};
