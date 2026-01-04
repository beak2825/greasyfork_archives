// Open a website on installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      // URL to open when the extension is installed
      chrome.tabs.create({ url: "https://url.najm.uk/SPARXSOLVEREXTENSION-WELCOME" });
    }
  });
  

  // Open a website on uninstallation
  chrome.runtime.setUninstallURL("https://url.najm.uk/SPARXSOLVEREXTENSION-GOODBYE", () => {
    if (chrome.runtime.lastError) {
      console.error("Failed to set uninstall URL:", chrome.runtime.lastError.message);
    }
  });
  