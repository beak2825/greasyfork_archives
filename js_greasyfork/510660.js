// ==UserScript==
// @name         Sploop.io Greeting Message (Made By FunkyAid)
// @description  console pastable, theres a button that opens menu u can enable or disable things set the greeting msg and notifications of ur changes.
// @version      FINAL
// @author      FunkyAid (discord user = funkyaid.py)
// @match        *://sploop.io/*
// @run-at       document-start
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/510660/Sploopio%20Greeting%20Message%20%28Made%20By%20FunkyAid%29.user.js
// @updateURL https://update.greasyfork.org/scripts/510660/Sploopio%20Greeting%20Message%20%28Made%20By%20FunkyAid%29.meta.js
// ==/UserScript==
// Get the username input
let usernameInput = prompt("Please enter your username:");
let greetingMessage = "";
let greetingElement;
let settingsMenu;
let menuButton;
let notificationContainer;
let notificationHeader;
let greetingDisplay;
let notificationCount = 0;
let showUsername = false;
let showGreeting = false;

// Check if the username input is valid
if (usernameInput !== null && usernameInput !== "") {
  // Create the greeting message
  function createGreeting() {
    greetingMessage = "Welcome";
    greetingElement = document.createElement("p");
    greetingElement.textContent = greetingMessage;
    greetingElement.style.position = "fixed";
    greetingElement.style.top = "10px";
    greetingElement.style.left = "50%";
    greetingElement.style.transform = "translateX(-50%)";
    greetingElement.style.width = "300px";
    greetingElement.style.textAlign = "center";
    greetingElement.style.fontSize = "24px";
    greetingElement.style.fontWeight = "bold";
    greetingElement.style.background = "#3498db";
    greetingElement.style.padding = "10px";
    greetingElement.style.borderRadius = "10px";
    greetingElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    greetingElement.style.color = "#ffffff";
    greetingElement.style.zIndex = "9999";
    greetingElement.style.display = "none";

    // Create the close button for the greeting message
    const greetingCloseButton = document.createElement("button");
    greetingCloseButton.textContent = "X";
    greetingCloseButton.style.position = "absolute";
    greetingCloseButton.style.top = "10px";
    greetingCloseButton.style.right = "10px";
    greetingCloseButton.style.width = "20px";
    greetingCloseButton.style.height = "20px";
    greetingCloseButton.style.background = "#ffffff";
    greetingCloseButton.style.border = "1px solid #cccccc";
    greetingCloseButton.style.borderRadius = "10px";
    greetingCloseButton.style.cursor = "pointer";
    greetingCloseButton.addEventListener("click", () => {
      greetingElement.style.display = "none";
    });
    greetingElement.appendChild(greetingCloseButton);

    // Create the menu button
    menuButton = document.createElement("div");
    menuButton.id = "splomod-menu-button";
    menuButton.style.position = "fixed";
    menuButton.style.top = "50%";
    menuButton.style.right = "10px";
    menuButton.style.transform = "translateY(-50%)";
    menuButton.style.width = "60px";
    menuButton.style.height = "60px";
    menuButton.style.background = "linear-gradient(to right, #e67e22, #d35400)";
    menuButton.style.borderRadius = "10px";
    menuButton.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
    menuButton.style.cursor = "pointer";
    menuButton.style.display = "flex";
    menuButton.style.justifyContent = "center";
    menuButton.style.alignItems = "center";
    menuButton.style.zIndex = "9999";

    const menuIcon = document.createElement("i");
    menuIcon.className = "fas fa-bars";
    menuIcon.style.fontSize = "24px";
    menuIcon.style.color = "#ffffff";
    menuButton.appendChild(menuIcon);

    // Create the notification header
    notificationHeader = document.createElement("div");
    notificationHeader.textContent = "Notifications";
    notificationHeader.style.position = "fixed";
    notificationHeader.style.top = "70px";
    notificationHeader.style.right = "10px";
    notificationHeader.style.width = "200px";
    notificationHeader.style.height = "auto";
    notificationHeader.style.background = "#f9f9f9";
    notificationHeader.style.padding = "10px";
    notificationHeader.style.borderRadius = "10px";
    notificationHeader.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    notificationHeader.style.zIndex = "9999";

    // Create the notification container
    notificationContainer = document.createElement("div");
    notificationContainer.id = "splomod-notification-container";
    notificationContainer.style.position = "fixed";
    notificationContainer.style.top = "120px";
    notificationContainer.style.right = "10px";
    notificationContainer.style.width = "200px";
    notificationContainer.style.height = "auto";
    notificationContainer.style.background = "#f9f9f9";
    notificationContainer.style.padding = "20px";
    notificationContainer.style.borderRadius = "10px";
    notificationContainer.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    notificationContainer.style.overflowY = "auto";
    notificationContainer.style.zIndex = "9999";

    // Create the settings menu
    settingsMenu = document.createElement("div");
    settingsMenu.id = "splomod-settings-menu";
    settingsMenu.style.position = "fixed";
    settingsMenu.style.top = "50%";
    settingsMenu.style.left = "50%";
    settingsMenu.style.transform = "translate(-50%, -50%)";
    settingsMenu.style.width = "300px";
    settingsMenu.style.height = "auto";
    settingsMenu.style.background = "#f9f9f9";
    settingsMenu.style.padding = "20px";
    settingsMenu.style.borderRadius = "10px";
    settingsMenu.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
    settingsMenu.style.display = "none";
    settingsMenu.style.zIndex = "9999";

    // Create the settings menu content
    const settingsContainer = document.createElement("div");
    settingsContainer.style.width = "100%";
    settingsContainer.style.height = "auto";
    settingsContainer.style.padding = "20px";

    const settingsLabel = document.createElement("label");
    settingsLabel.textContent = "Customize Greeting Message:";
    settingsLabel.style.fontWeight = "bold";
    settingsContainer.appendChild(settingsLabel);

    const settingsInput = document.createElement("input");
    settingsInput.type = "text";
    settingsInput.value = "(message)";
    settingsInput.style.width = "100%";
    settingsInput.style.height = "40px";
    settingsInput.style.padding = "10px";
    settingsInput.style.borderRadius = "10px";
    settingsInput.style.border = "1px solid #cccccc";
    settingsContainer.appendChild(settingsInput);

    const settingsCloseButton = document.createElement("button");
    settingsCloseButton.textContent = "Close";
    settingsCloseButton.style.width = "100%";
    settingsCloseButton.style.height = "40px";
    settingsCloseButton.style.padding = "10px";
    settingsCloseButton.style.borderRadius = "10px";
    settingsCloseButton.style.border = "1px solid #cccccc";
    settingsCloseButton.style.background = "#ffffff";
    settingsCloseButton.style.cursor = "pointer";
    settingsCloseButton.addEventListener("click", () => {
      settingsMenu.style.display = "none";
    });
    settingsContainer.appendChild(settingsCloseButton);

    const showUsernameContainer = document.createElement("div");
    showUsernameContainer.style.width = "100%";
    showUsernameContainer.style.height = "auto";
    showUsernameContainer.style.padding = "10px";
    showUsernameContainer.style.borderBottom = "1px solid #cccccc";

    const showUsernameLabel = document.createElement("label");
    showUsernameLabel.textContent = "Show Username";
    showUsernameLabel.style.fontWeight = "bold";
    showUsernameContainer.appendChild(showUsernameLabel);

    const showUsernameButtonContainer = document.createElement("div");
    showUsernameButtonContainer.style.display = "flex";
    showUsernameButtonContainer.style.justifyContent = "space-between";
    showUsernameButtonContainer.style.width = "100%";
    showUsernameButtonContainer.style.padding = "10px";

    const showUsernameEnabled = document.createElement("button");
    showUsernameEnabled.textContent = "Enabled";
    showUsernameEnabled.style.width = "50%";
    showUsernameEnabled.style.height = "40px";
    showUsernameEnabled.style.padding = "10px";
    showUsernameEnabled.style.borderRadius = "10px";
    showUsernameEnabled.style.border = "1px solid #cccccc";
    showUsernameEnabled.style.background = "#32CD32";
    showUsernameEnabled.style.cursor = "pointer";
    showUsernameEnabled.addEventListener("click", () => {
      showUsername = true;
      greetingElement.textContent = settingsInput.value.replace("(message)", "Good Morning") + " " + usernameInput;
      showUsernameEnabled.style.background = "#32CD32";
      showUsernameDisabled.style.background = "#FF0000";
    });
    showUsernameButtonContainer.appendChild(showUsernameEnabled);

    const showUsernameDisabled = document.createElement("button");
    showUsernameDisabled.textContent = "Disabled";
    showUsernameDisabled.style.width = "50%";
    showUsernameDisabled.style.height = "40px";
    showUsernameDisabled.style.padding = "10px";
    showUsernameDisabled.style.borderRadius = "10px";
    showUsernameDisabled.style.border = "1px solid #cccccc";
    showUsernameDisabled.style.background = "#FF0000";
    showUsernameDisabled.style.cursor = "pointer";
    showUsernameDisabled.addEventListener("click", () => {
      showUsername = false;
      greetingElement.textContent = settingsInput.value.replace("(message)", "Good Morning");
      showUsernameEnabled.style.background = "#cccccc";
      showUsernameDisabled.style.background = "#FF0000";
    });
    showUsernameButtonContainer.appendChild(showUsernameDisabled);

    showUsernameContainer.appendChild(showUsernameButtonContainer);

    const showUsernameDescription = document.createElement("p");
    showUsernameDescription.textContent = "Show or hide the username in the greeting message.";
    showUsernameDescription.style.width = "100%";
    showUsernameDescription.style.height = "auto";
    showUsernameDescription.style.padding = "10px";
    showUsernameDescription.style.borderBottom = "1px solid #cccccc";
    showUsernameContainer.appendChild(showUsernameDescription);

    settingsContainer.appendChild(showUsernameContainer);

    const showGreetingContainer = document.createElement("div");
    showGreetingContainer.style.width = "100%";
    showGreetingContainer.style.height = "auto";
    showGreetingContainer.style.padding = "10px";
    showGreetingContainer.style.borderBottom = "1px solid #cccccc";

    const showGreetingLabel = document.createElement("label");
    showGreetingLabel.textContent = "Show Greeting";
    showGreetingLabel.style.fontWeight = "bold";
    showGreetingContainer.appendChild(showGreetingLabel);

    const showGreetingButtonContainer = document.createElement("div");
    showGreetingButtonContainer.style.display = "flex";
    showGreetingButtonContainer.style.justifyContent = "space-between";
    showGreetingButtonContainer.style.width = "100%";
    showGreetingButtonContainer.style.padding = "10px";

    const showGreetingEnabled = document.createElement("button");
    showGreetingEnabled.textContent = "Enabled";
    showGreetingEnabled.style.width = "50%";
    showGreetingEnabled.style.height = "40px";
    showGreetingEnabled.style.padding = "10px";
    showGreetingEnabled.style.borderRadius = "10px";
    showGreetingEnabled.style.border = "1px solid #cccccc";
    showGreetingEnabled.style.background = "#32CD32";
    showGreetingEnabled.style.cursor = "pointer";
    showGreetingEnabled.addEventListener("click", () => {
      showGreeting = true;
      greetingElement.style.display = "block";
      showGreetingEnabled.style.background = "#32CD32";
      showGreetingDisabled.style.background = "#FF0000";
    });
    showGreetingButtonContainer.appendChild(showGreetingEnabled);

    const showGreetingDisabled = document.createElement("button");
    showGreetingDisabled.textContent = "Disabled";
    showGreetingDisabled.style.width = "50%";
    showGreetingDisabled.style.height = "40px";
    showGreetingDisabled.style.padding = "10px";
    showGreetingDisabled.style.borderRadius = "10px";
    showGreetingDisabled.style.border = "1px solid #cccccc";
    showGreetingDisabled.style.background = "#FF0000";
    showGreetingDisabled.style.cursor = "pointer";
    showGreetingDisabled.addEventListener("click", () => {
      showGreeting = false;
      greetingElement.style.display = "none";
      showGreetingEnabled.style.background = "#cccccc";
      showGreetingDisabled.style.background = "#FF0000";
    });
    showGreetingButtonContainer.appendChild(showGreetingDisabled);

    showGreetingContainer.appendChild(showGreetingButtonContainer);

    const showGreetingDescription = document.createElement("p");
    showGreetingDescription.textContent = "Show or hide the greeting message.";
    showGreetingDescription.style.width = "100%";
    showGreetingDescription.style.height = "auto";
    showGreetingDescription.style.padding = "10px";
    showGreetingDescription.style.borderBottom = "1px solid #cccccc";
    showGreetingContainer.appendChild(showGreetingDescription);

    settingsContainer.appendChild(showGreetingContainer);

    settingsMenu.appendChild(settingsContainer);

    // Add event listeners
    menuButton.addEventListener("click", () => {
      if (settingsMenu.style.display === "none") {
        settingsMenu.style.display = "block";
        settingsMenu.style.left = "50%";
      } else {
        settingsMenu.style.display = "none";
        settingsMenu.style.left = "-300px";
      }
    });

    settingsInput.addEventListener("input", () => {
      const updatedGreetingMessage = settingsInput.value.replace("(message)", "Good Morning");
      if (showUsername) {
        greetingElement.textContent = updatedGreetingMessage + " " + usernameInput;
      } else {
        greetingElement.textContent = updatedGreetingMessage;
      }
      const notificationItem = document.createElement("div");
      notificationItem.style.width = "100%";
      notificationItem.style.height = "auto";
      notificationItem.style.background = "#f9f9f9";
      notificationItem.style.padding = "10px";
 notificationItem.style.borderRadius = "10px";
      notificationItem.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      notificationItem.textContent = "Greeting message updated to: " + greetingElement.textContent;

      const notificationCloseButton = document.createElement("button");
      notificationCloseButton.textContent = "X";
      notificationCloseButton.style.position = "absolute";
      notificationCloseButton.style.top = "10px";
      notificationCloseButton.style.right = "10px";
      notificationCloseButton.style.width = "20px";
      notificationCloseButton.style.height = "20px";
      notificationCloseButton.style.background = "#ffffff";
      notificationCloseButton.style.border = "1px solid #cccccc";
      notificationCloseButton.style.borderRadius = "10px";
      notificationCloseButton.style.cursor = "pointer";
      notificationCloseButton.addEventListener("click", () => {
        notificationItem.remove();
      });
      notificationItem.appendChild(notificationCloseButton);

      notificationContainer.appendChild(notificationItem);
      notificationContainer.style.display = "block";
      notificationCount++;

      setTimeout(() => {
        notificationItem.style.opacity = "0";
        setTimeout(() => {
          notificationItem.remove();
          if (notificationContainer.children.length === 0) {
            notificationContainer.style.display = "none";
          }
        }, 1000);
      }, 2000);
    });

    // Add elements to the page
    document.body.appendChild(greetingElement);
    document.body.appendChild(menuButton);
    document.body.appendChild(notificationHeader);
    document.body.appendChild(notificationContainer);
    document.body.appendChild(settingsMenu);
  }
  createGreeting();
} else {
  alert("Please enter a valid username.");
}