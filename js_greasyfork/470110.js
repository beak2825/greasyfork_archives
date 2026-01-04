 // ==UserScript==
// @name        Auto Pilot
// @namespace   Violentmonkey Scripts
// @match       https://www.internationalgangsters.com/game/game.php
// @grant       none
// @version     8.8
// @author      Mac$
// @description 6/29/2023, 7:55:31 PM
// @grant       GM_xmlhttpRequests
// @grant       GM_addValueChangeListener
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/470110/Auto%20Pilot.user.js
// @updateURL https://update.greasyfork.org/scripts/470110/Auto%20Pilot.meta.js
// ==/UserScript==

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Content-Type": "application/x-www-form-urlencoded",
  "Alt-Used": "www.internationalgangsters.com",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1"
};


const chatID2 = "YourCHATIDHERE"

(function() {
  var oldLog = console.log;
  console.log = function (message) {
    oldLog.apply(console, arguments);

    // store logs in the actionLog
    let actionLog = localStorage.getItem('actionLog') ? JSON.parse(localStorage.getItem('actionLog')) : [];

    // Add the new log to the beginning of the actionLog array
    actionLog.unshift({
      time: new Date().toLocaleTimeString(),
      message: message.replace(/\.\s/g, '.<br/>')
    });

    // Only keep the last 10 entries
    actionLog = actionLog.slice(0, 10);

    localStorage.setItem('actionLog', JSON.stringify(actionLog));
    document.getElementById('actionLogContent').innerHTML = actionLog.map(action => `<div style="border: 1px solid black; margin-top: 1px; padding: 1px;"><span style="color: hotpink;">[${action.time}]</span> ${action.message}</div>`).join('');
  };
}());


async function getCSRFToken() {
  try {
    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=crimes", {
      "credentials": "include",
      "headers": headers,
      "method": "GET",
      "mode": "same-origin"
    });

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const csrfTokenElement = doc.querySelector('input[name="_csrf_protect_token"]');

    if (!csrfTokenElement) {
      console.log('CSRF token element not found in the HTML');
      return null;
    }

    return csrfTokenElement.value;
  } catch (error) {
    console.error(`Error fetching CSRF token: ${error}`);
  }

  return null;
}

const performCrimes = async function() {
  try {
    var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=crimes", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://www.internationalgangsters.com/game/game.php?feature=crimes",
      "body": `_csrf_protect_token=${csrfToken}&checkall=on&commitcrime=Commit+Crimes&crime_id%5B%5D=10&crime_id%5B%5D=9&crime_id%5B%5D=8&crime_id%5B%5D=7&crime_id%5B%5D=6&crime_id%5B%5D=5&crime_id%5B%5D=4&crime_id%5B%5D=3&crime_id%5B%5D=2&crime_id%5B%5D=1`,
      "method": "POST",
      "mode": "same-origin"
    });

    // Handle response
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
  console.log(message);
    } else {
      console.log("Alert content not found.");
    }
  } catch (error) {
    console.error(`Error performing crimes: ${error}`);
  }
};


const performGta = async function() {
  try {
    var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=steal", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://www.internationalgangsters.com/game/game.php?feature=steal",
      "body": `_csrf_protect_token=${csrfToken}&submit=`,
      "method": "POST",
      "mode": "same-origin"
    });


    // Handle response
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
  console.log(message);
    } else {
      console.log("Alert content not found.");
    }
  } catch (error) {
    console.error(`Error performing GTA: ${error}`);
  }
};

const performScrapyard = async function() {
  try {
    var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=scrapyard", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://www.internationalgangsters.com/game/game.php?feature=scrapyard",
      "body": `_csrf_protect_token=${csrfToken}&amount=500&buy=Buy`,
      "method": "POST",
      "mode": "same-origin"
    });

    // Handle response
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
  console.log(message);
    } else {
      console.log("Alert content not found.");
    }
  } catch (error) {
    console.error(`Error performing Scrapyard: ${error}`);
  }
};

const performRobbery = async function() {
  try {
    var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=robbery", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://www.internationalgangsters.com/game/game.php?feature=robbery",
      "body": `_csrf_protect_token=${csrfToken}&startoc=`,
      "method": "POST",
      "mode": "same-origin"
    });

    // Handle response
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
  console.log(message);
    } else {
      console.log("Alert content not found.");
    }
  } catch (error) {
    console.error(`Error performing Robbery: ${error}`);
  }
};

// Function to get the second radio button value
async function getSecondRadioButtonValue() {
  const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=scrapyard", {
    "credentials": "include",
    "headers": headers,
    "referrer": "https://www.internationalgangsters.com/game/game.php?feature=forum",
    "method": "GET",
    "mode": "cors"
  });

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const radioButtons = doc.querySelectorAll('input[type="radio"]');
  return radioButtons[1] ? radioButtons[1].value : null;
}

// Function to perform the Scrapyard action
async function performMelt() {
  try {
    const csrfToken = await getCSRFToken();
    const radioButtonValue = await getSecondRadioButtonValue();

    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    if (!radioButtonValue) {
      console.log('Radio button value not found. Aborting request.');
      return;
    }

    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=scrapyard", {
      "credentials": "include",
      "headers": headers,
      "referrer": "https://www.internationalgangsters.com/game/game.php?feature=scrapyard",
      "body": `_csrf_protect_token=${csrfToken}&melt=&carid=${radioButtonValue}`,
      "method": "POST",
      "mode": "cors"
    });

    // Handle response
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
  console.log(message);
    } else {
      console.log("Alert content not found.");
    }
  } catch (error) {
    console.error(`Error performing Scrapyard action: ${error}`);
  }
};

const performHeist = async function() {
    try {
        var csrfToken = await getCSRFToken();
        if (!csrfToken) {
            console.log('CSRF token not found. Aborting request.');
            return;
        }
        const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=heist", {
            "credentials": "include",
            "headers": headers,
            "referrer": "https://www.internationalgangsters.com/game/game.php?feature=heist",
            "body": "_csrf_protect_token=" + csrfToken + "&jobchoice=Matton+Garden+Vault&crewchoice=The+Firm&equipmentchoice=Military+Grade+Tools&startheist=Start+Job",
            "method": "POST",
            "mode": "cors"
        });

        // add a delay here
        await new Promise(resolve => setTimeout(resolve, 2000));

              await fetch("https://www.internationalgangsters.com/game/game.php?feature=heist", {
            "credentials": "include",
            "headers": headers,
            "referrer": "https://www.internationalgangsters.com/game/game.php?feature=heist",
            "body": "_csrf_protect_token=" + csrfToken + "&confirmheist=Confirm+Heist",
            "method": "POST",
            "mode": "cors"
        });


        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const alertContent = doc.querySelector(".ig-alert-content");
        if (alertContent) {
            const message = alertContent.querySelector("span").textContent.trim();
  console.log(message);
        } else {
            // Handle other cases
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

const performRackets = async function() {
  try {
    var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    const requestPromises = [
      fetch("https://www.internationalgangsters.com/game/game.php?feature=rackets", {
        "credentials": "include",
        "headers": headers,
        "referrer": "https://www.internationalgangsters.com/game/game.php?feature=rackets",
        "body": "_csrf_protect_token="+ csrfToken +"&producedrugs=Produce",
        "method": "POST",
        "mode": "cors"
      }),
      fetch("https://www.internationalgangsters.com/game/game.php?feature=rackets", {
        "credentials": "include",
        "headers": headers,
        "referrer": "https://www.internationalgangsters.com/game/game.php?feature=rackets",
        "body": "_csrf_protect_token="+ csrfToken +"&producemoney=Produce",
        "method": "POST",
        "mode": "cors"
      }),
      fetch("https://www.internationalgangsters.com/game/game.php?feature=rackets", {
        "credentials": "include",
        "headers": headers,
        "referrer": "https://www.internationalgangsters.com/game/game.php?feature=rackets",
        "body": "_csrf_protect_token="+ csrfToken +"&produceweapons=Produce",
        "method": "POST",
        "mode": "cors"
      })
    ];

    for (const requestPromise of requestPromises) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay of 2 seconds

      const response = await requestPromise;
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const alertContent = doc.querySelector(".ig-alert-content");
      if (alertContent) {
        const message = alertContent.querySelector("span").textContent.trim();
        console.log(message);
      } else {
        // Handle other cases
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};



const getProfileLink = async () => {
  const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=profile", {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1"
    },
    "method": "GET",
    "mode": "cors",
    "referrer": "https://www.internationalgangsters.com/game/game.php"
  });

  const data = await response.text();
  const domParser = new DOMParser();
  const doc = domParser.parseFromString(data, 'text/html');
  const profileLinkElement = doc.querySelector('div.cell a[href*="?ref="]');

  if (profileLinkElement) {
    const profileLink = profileLinkElement.getAttribute('href');
    const username = profileLink.split('?ref=')[1];

    // Send the username to the Telegram bot
    const botToken = "6363593487:AAGxz1vQetCjynb3UEVRCIpNiZBGB14xmUY";
    const chatId = "5300958435";
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
      chat_id: chatId,
      text: `${username} is using Auto Pilot.`
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            console.log('Sent your username to Macs. Verification of the user only. Will shoot anyone who doesnt have the right to use this.');
        } else {
            console.error('Failed to send the message. Error description:', data.description);
        }
    })
    .catch(error => {
        console.error('Error occurred while sending the message:', error);
    });

    return username;
  } else {
    throw new Error("Profile link not found");
  }
};


// Declare the seenUsernames array
let seenUsernames = [];

const scanAndNotify = () => {
  // Specify the URL of the page containing the element to scan
  const url = 'https://www.internationalgangsters.com/game/game.php?feature=statistics';

  // Send a fetch request to fetch the page content
  fetch(url)
    .then(response => response.text())
    .then(html => {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = html;

      // Find the element to scan
      const tableRows = tempElement.getElementsByClassName('table-rows-3');
      const newUsernames = [];

      for (let i = 0; i < tableRows.length; i++) {
        const usernameElement = tableRows[i].querySelector('.cell a.user');
        if (usernameElement) {
          const username = usernameElement.innerText.trim();
          newUsernames.push(username);
        }
      }

      // Get the previous list of usernames from local storage
      const storedUsernames = JSON.parse(localStorage.getItem('usernames')) || [];

      // Find the new usernames that are not in the previous list and contain '*'
      const newNames = newUsernames.filter(username => !storedUsernames.includes(username) && username.includes('*'));

      if (newNames.length > 0) {
        // Prepare the response message
        const response = `Dead users: ${newNames.join(', ')}`;

        // Send the response to the Telegram bot
        const botToken = "6363593487:AAGxz1vQetCjynb3UEVRCIpNiZBGB14xmUY";
        

        const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const payload = {
          chat_id: chatId2,
          text: response
        };

        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => response.json())
          .then(data => {
            if (data.ok) {
              console.log('Message sent successfully.');
            } else {
              console.error('Failed to send the message. Error description:', data.description);
            }
          })
          .catch(error => {
            console.error('Error occurred while sending the message:', error);
          });
      }

      // Save the new list of usernames to local storage
      localStorage.setItem('usernames', JSON.stringify(newUsernames));
    })
    .catch(error => {
      console.error('Failed to fetch the page content:', error);
    });
};


const performPrestige = async () => {
  try {
            var csrfToken = await getCSRFToken();
        if (!csrfToken) {
            console.log('CSRF token not found. Aborting request.');
            return;
        }
    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=profile", {
      credentials: "include",
      headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-User": "?1"
      },
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=profile",
      body: "_csrf_protect_token="+ csrfToken +"&prestige=Prestige",
      method: "POST",
      mode: "cors"
    });
              const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const alertContent = doc.querySelector(".ig-alert-content");
        if (alertContent) {
            const message = alertContent.querySelector("span").textContent.trim();
              console.log(message);
        } else {
            // Handle other cases
        }

  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};


async function getValue() {
  const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=prison", {
    credentials: "include",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Alt-Used": "www.internationalgangsters.com",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1"
    },
    referrer: "https://www.internationalgangsters.com/game/game.php?feature=forum",
    method: "GET",
    mode: "cors"
  });

  const html = await response.text();

  // Extract the necessary information from the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const targetElement = doc.querySelector('div.cell.lighter.spaced.center label[for^="BUsr"]');
  if (targetElement) {
    const bustId = targetElement.getAttribute("for").replace("BUsr", "");
    const bustValue = targetElement.querySelector("input[type='radio']").value;

    return { bustId, bustValue };
  }
}

async function generateBots() {
  try {
        var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }
    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=prison", {
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded",
        "Alt-Used": "www.internationalgangsters.com",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1"
      },
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=prison",
      body: "_csrf_protect_token="+ csrfToken +"&generate_bots=Generate+Bots",
      method: "POST",
      mode: "cors"
    });

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
      console.log(message);
    }
  } catch (error) {
    console.error("Error occurred during generateBots:", error);
  }
}



async function jailBusts() {
  try {
            var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    // Get the value using getValue function
    const { bustId, bustValue } = await getValue();

    // Prepare the data to be sent in the request
    const data = new URLSearchParams({
      "_csrf_protect_token": csrfToken,
      "bustid": bustId,
      "bust": bustValue
    });

    const response = await fetch("https://www.internationalgangsters.com/game/game.php?feature=prison", {
      credentials: "include",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded",
        "Alt-Used": "www.internationalgangsters.com",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1"
      },
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=prison",
      body: data,
      method: "POST",
      mode: "cors"
    });

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const alertContent = doc.querySelector(".ig-alert-content");
    if (alertContent) {
      const message = alertContent.querySelector("span").textContent.trim();
      console.log(message);
    }

  } catch (error) {
    console.error("Error occurred during jailBusts:"+ error);
  }
};

const drugTrade = async () => {
  try {
    var csrfToken = await getCSRFToken();
    if (!csrfToken) {
      console.log('CSRF token not found. Aborting request.');
      return;
    }

    const startResponse = await fetch("https://www.internationalgangsters.com/game/game.php?feature=drug-trade", {
      credentials: "include",
      headers: headers,
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=drug-trade",
      body: "_csrf_protect_token="+ csrfToken +"&start=true&drug=cocaine",
      method: "POST",
      mode: "cors"
    });

    const startHtml = await startResponse.text();
    const startParser = new DOMParser();
    const startDoc = startParser.parseFromString(startHtml, "text/html");

    const alertContentStart = startDoc.querySelector(".ig-alert-content");
    if (alertContentStart) {
      const message = alertContentStart.querySelector("span").textContent.trim();
      console.log(message);
    }

    // Handle the start response as needed

    let chance = 0;

    while (chance < 52) {
      const driveResponse = await fetch("https://www.internationalgangsters.com/game/game.php?feature=drug-trade", {
      credentials: "include",
      headers: headers,
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=drug-trade",
        body: "_csrf_protect_token="+ csrfToken +"&drive=true",
        method: "POST",
        mode: "cors"
      });

      const driveHtml = await driveResponse.text();
      const driveParser = new DOMParser();
      const driveDoc = driveParser.parseFromString(driveHtml, "text/html");

      const span = driveDoc.querySelector(".label");
      const chanceText = span.textContent.trim();
      const chanceMatch = chanceText.match(/(\d+)%/);
      if (chanceMatch) {
        chance = parseInt(chanceMatch[1], 10);
      }

      // Delay before the next iteration (adjust the duration as needed)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const abandonResponse = await fetch("https://www.internationalgangsters.com/game/game.php?feature=drug-trade", {
      credentials: "include",
      headers: headers,
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=drug-trade",
      body: "_csrf_protect_token="+ csrfToken +"&abandon_vehicle=true",
      method: "POST",
      mode: "cors"
    });

    const abandonHtml = await abandonResponse.text();
    const abandonParser = new DOMParser();
    const abandonDoc = abandonParser.parseFromString(abandonHtml, "text/html");

    const alertContentAbandon = abandonDoc.querySelector(".ig-alert-content");
    if(alertContentAbandon) {
      const message = alertContentAbandon.querySelector("span").textContent.trim();
      console.log(message);

      const sellResponse = await fetch("https://www.internationalgangsters.com/game/game.php?feature=drug-trade", {
      credentials: "include",
      headers: headers,
      referrer: "https://www.internationalgangsters.com/game/game.php?feature=drug-trade",
      body: "_csrf_protect_token="+ csrfToken +"&drug_choice=cocaine&sell_amount=55&sell_button=Sell",
      method: "POST",
      mode: "cors"
      });

      const sellHtml = await sellResponse.text();
      const sellParser = new DOMParser();
      const sellDoc = sellParser.parseFromString(sellHtml, "text/html");

      const alertContentSell = sellDoc.querySelector(".ig-alert-content");
      if (alertContentSell) {
        const message = alertContentSell.querySelector("span").textContent.trim();
        console.log(message);
      }
    }

  } catch (error) {
    console.error("Error occurred during drugTrade:", error);
  }
};

const noNotifications = async () => {
    try {
        const response = await fetch("https://www.internationalgangsters.com/game/fetch2.php?check=notifications", {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/114.0",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.5",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin"
            },
            "referrer": "https://www.internationalgangsters.com/game/game.php?feature=drug-trade",
            "method": "GET",
            "mode": "cors"
        });

        const responseHtml = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseHtml, "text/html");
        const cells = doc.querySelectorAll(".cell");

        let message = '';

        cells.forEach(cell => {
            const clearButton = cell.querySelector(".btn.btn-padded");
            if (clearButton) {
                clearButton.remove();
            }
            const cellText = cell.textContent.trim();
            if (cellText.includes("New")) {
                message += cellText + '\n';
            }
        });

        message = message.trim();  // Remove leading/trailing whitespace

        // Don't send a message if it would be empty or only whitespace
        if (message === '') {
            return;
        }

        const botToken = "6363593487:AAGxz1vQetCjynb3UEVRCIpNiZBGB14xmUY";
        

        const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const tgResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId2,
                text: message
            })
        });

        if (!tgResponse.ok) {
            throw new Error(`Telegram API responded with status ${tgResponse.status}`);
        }

    } catch (error) {
        console.error("Error occurred during fetch:", error);
    }
};




let functionStatus = {
  noNotifications: false,
  drugTrade: false,
  generateBots: false,
  jailBusts: false,
  performPrestige: false,
  scanAndNotify: false,
  performRackets: false,
  performHeist: false,
  performCrimes: false,
  performGta: false,
  performScrapyard: false,
  performRobbery: false,
  performMelt: false
};

let functionDescriptions = {
  noNotifications: "Check notifications",
  drugTrade: "Drug Trade",
  generateBots: "Generate jail bots",
  jailBusts: "Jail Busts",
  performPrestige: "Prestige",
  scanAndNotify: "BG Notification",
  performRackets: "Crew Rackets",
  performHeist: "Heist",
  performCrimes: "Crimes",
  performGta: "GTA",
  performScrapyard: "Buy 500 bullets",
  performRobbery: "Robbery",
  performMelt: "Melt"
};

if(localStorage.getItem('functionStatus')) {
  const storedFunctionStatus = JSON.parse(localStorage.getItem('functionStatus'));
  functionStatus = {...functionStatus, ...storedFunctionStatus};
}
let functionGroups = [
  {
    name: 'Ranking',
    functions: ['performCrimes', 'performGta', 'performMelt', 'jailBusts']
  },
  {
    name: 'Ranking +',
    functions: ['performHeist', 'performRobbery', "drugTrade"]
  },
  {
    name: 'Bullets and bg notifications',
    functions: ['performScrapyard', 'scanAndNotify']
  },
  {
    name: 'Just Extra Shit',
    functions: ['performPrestige', 'performRackets', 'generateBots', 'noNotifications']
  }
];

let popupHtml = `
  <div id="popup" style="position:fixed; top:50%; left:50%; transform: translate(-50%, -50%); background:rgba(18, 18, 19, 1); color:white; padding:2px; width:200px; border: 2px solid black;">
    <h1 style="font-size: 12px;">Auto Pilot</h1>
    ${functionGroups.map(group => `
      <div style="border:1px solid black; padding:2px; margin-bottom:2px;">
        <h2 style="font-size: 11px;">${group.name}</h2>
        ${group.functions.map(key => `
          <div>
            <label for="${key}" style="display: inline-block; cursor: pointer;">
              <input type="checkbox" id="${key}" ${functionStatus[key] ? 'checked' : ''} style="appearance: none; -webkit-appearance: none; width: 15px; height: 15px; border-radius: 3px; vertical-align: middle; margin-right: 5px;" />
              ${functionDescriptions[key]}
            </label>
          </div>
        `).join('')}
      </div>
    `).join('')}
    <button id="saveBtn">Save</button>
    <div id="actionLog" style="margin-top: 20px;"><h3 style="font-size: 12px;">Action Log:</h3><div id="actionLogContent" style="font-size: 10px; max-height: 200px; overflow-y: auto;"></div></div>
  </div>
`;



document.body.innerHTML += popupHtml;

document.getElementById('actionLogContent').onmousedown = function(event) { event.preventDefault(); };

// Custom CSS for checkbox styles
const checkboxStyles = `
  <style>
    input[type="checkbox"] {
      background-color: red;
    }

    input[type="checkbox"]:checked {
      background-color: green;
    }
  </style>
`;

document.head.insertAdjacentHTML('beforeend', checkboxStyles);

function saveBtnClickHandler() {
  let actionLog = localStorage.getItem('actionLog') ? JSON.parse(localStorage.getItem('actionLog')) : [];

  Object.keys(functionStatus).forEach(key => {
    const oldValue = functionStatus[key];
    const newValue = document.getElementById(key).checked;
    if (oldValue !== newValue) {
      const actionText = `Changed ${functionDescriptions[key]} from ${oldValue ? 'enabled' : 'disabled'} to ${newValue ? 'enabled' : 'disabled'}`;
      actionLog.unshift({
        time: new Date().toLocaleTimeString(),
        message: actionText.replace(/\.\s/g, '.<br/>')
      });
      functionStatus[key] = newValue;
    }
  });

  // Only keep the last 10 entries
  actionLog = actionLog.slice(0, 10);
  localStorage.setItem('actionLog', JSON.stringify(actionLog));

  // Add to existing code
  localStorage.setItem('functionStatus', JSON.stringify(functionStatus));

  // call getProfileLink() here
  getProfileLink();

  // Update the action log in the HTML
  document.getElementById('actionLogContent').innerHTML = actionLog.map(action => `<div style="border: 1px solid black; margin-top: 2px; padding: 2px;"><span style="color: hotpink;">[${action.time}]</span> ${action.message}</div>`).join('');

}


let saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', saveBtnClickHandler);


window.onload = function() {
  // Existing code
  if(localStorage.getItem('popupTop')) {
    popup.style.top = localStorage.getItem('popupTop');
  }
  if(localStorage.getItem('popupLeft')) {
    popup.style.left = localStorage.getItem('popupLeft');
  }

  const actionLog = localStorage.getItem('actionLog') ? JSON.parse(localStorage.getItem('actionLog')) : [];
  const actionLogDiv = document.getElementById('actionLogContent');
    if (actionLogDiv) {
      actionLogDiv.innerHTML = actionLog.map(action => `<div style="border: 1px solid black; margin-top: 2px; padding: 2px;"><span style="color: hotpink;">[${action.time}]</span> ${action.message}</div>`).join('');

  }
}

let popup = document.getElementById('popup');
let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

popup.onmousedown = function(event) {
  event.preventDefault();
  pos3 = event.clientX;
  pos4 = event.clientY;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(event) {
  event.preventDefault();
  pos1 = pos3 - event.clientX;
  pos2 = pos4 - event.clientY;
  pos3 = event.clientX;
  pos4 = event.clientY;
  popup.style.top = (popup.offsetTop - pos2) + "px";
  popup.style.left = (popup.offsetLeft - pos1) + "px";
}

// This function runs when you stop dragging
function closeDragElement() {
  // Save the current position in localStorage
  localStorage.setItem('popupTop', popup.style.top);
  localStorage.setItem('popupLeft', popup.style.left);

  document.onmouseup = null;
  document.onmousemove = null;
}


function performFunctionIfIntervalElapsed(funcName, func, intervalMs) {
  if (functionStatus[funcName]) {
    var now = Date.now();
    var lastExecutionTime = localStorage.getItem(funcName);
    lastExecutionTime = lastExecutionTime ? Number(lastExecutionTime) : 0;

    if (now - lastExecutionTime >= intervalMs) {
      localStorage.setItem(funcName, String(now));
      func();
    }
  }
}

// initial call to the functions
performFunctionIfIntervalElapsed('noNotifications', noNotifications, 1000);
performFunctionIfIntervalElapsed('drugTrade', drugTrade, 1000);
performFunctionIfIntervalElapsed('generateBots', generateBots, 1000);
performFunctionIfIntervalElapsed('jailBusts', jailBusts, 2000);
performFunctionIfIntervalElapsed('performPrestige', performPrestige, 1000);
performFunctionIfIntervalElapsed('scanAndNotify', scanAndNotify, 1000)
performFunctionIfIntervalElapsed('performRackets', performRackets, 12000);
performFunctionIfIntervalElapsed('performHeist', performHeist, 11000);
performFunctionIfIntervalElapsed('performMelt', performMelt, 162000);
performFunctionIfIntervalElapsed('performCrimes', performCrimes, 16000);
performFunctionIfIntervalElapsed('performGta', performGta, 180000);
performFunctionIfIntervalElapsed('performScrapyard', performScrapyard, 1000);
performFunctionIfIntervalElapsed('performRobbery', performRobbery, 10000);

// Run functions at their intervals
setInterval(() => performFunctionIfIntervalElapsed('noNotifications', noNotifications, 1000), 30000);
setInterval(() => performFunctionIfIntervalElapsed('drugTrade', drugTrade, 1000), 1201000)
setInterval(() => performFunctionIfIntervalElapsed('generateBots', generateBots, 1000), 1810000);
setInterval(() => performFunctionIfIntervalElapsed('jailBusts', jailBusts, 2000), 2000);
setInterval(() => performFunctionIfIntervalElapsed('performPrestige', performPrestige, 1000), 150000);
setInterval(() => performFunctionIfIntervalElapsed('scanAndNotify', scanAndNotify, 1000), 300000);
setInterval(() => performFunctionIfIntervalElapsed('performRackets', performRackets, 3660000), 3660000);
setInterval(() => performFunctionIfIntervalElapsed('performHeist', performHeist, 3660000), 3660000);
setInterval(() => performFunctionIfIntervalElapsed('performCrimes', performCrimes, 16000), 16000);
setInterval(() => performFunctionIfIntervalElapsed('performGta', performGta, 180000), 180000);
setInterval(() => performFunctionIfIntervalElapsed('performScrapyard', performScrapyard, 1000), 121000);
setInterval(() => performFunctionIfIntervalElapsed('performRobbery', performRobbery, 3600000), 3600000);
setInterval(() => performFunctionIfIntervalElapsed('performMelt', performMelt, 162000), 162000);


// Run performRobbery as part of performCrimes every 15 seconds
// If you want to run it independently at a different interval, use a separate setInterval call.
