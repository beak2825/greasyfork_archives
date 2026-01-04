Tabs.ItemTracker = {
    tabOrder: 920, // Place after Auto Porter Blocker tab
    tabLabel: 'Item Tracker',
    tabDisabled: false,
    myDiv: null,
    itemLog: [],

    init: function(div) {
        var t = Tabs.ItemTracker;
        t.myDiv = div;
        t.createUI();
        t.hookInventory();
        t.loadItemLog();
    },

    createUI: function() {
        var t = Tabs.ItemTracker;
        var m = '<DIV class=divHeader align=center>' + tx('Item Tracker') + '</div>';

        m += '<div id="pbItemLog" style="width: 100%; height: 300px; overflow-y: auto; border: 1px solid #888; padding: 5px;"></div>';
        m += '<button id="pbClearItemLog">Clear Log</button>';

        t.myDiv.innerHTML = m;

        ById('pbClearItemLog').addEventListener('click', function() { t.clearItemLog(); });
    },

    hookInventory: function() {
        var t = Tabs.ItemTracker;
        // This is a placeholder. You need to find the actual inventory element in the game.
        var inventoryElement = document.querySelector('#inventory_container'); // Replace with the correct selector

        if (inventoryElement) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        // Check for changes that indicate item usage (e.g., removal from inventory)
                        t.detectItemUsage(mutation);
                    }
                });
            });

            observer.observe(inventoryElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class'] // Example: track class changes
            });
        } else {
            console.error('Could not find inventory element.  Update the selector in hookInventory().');
        }
    },

    detectItemUsage: function(mutation) {
        var t = Tabs.ItemTracker;
        // This is a placeholder. You need to implement the logic to detect item usage based on the mutation.
        // Examine the mutation to determine if an item was used.
        // For example, check if a node was removed from the inventory or if an item's quantity changed.

        if (mutation.removedNodes && mutation.removedNodes.length > 0) {
            mutation.removedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('item')) { // Example: Check for removed item elements
                    var itemName = node.textContent || node.innerText || ''; // Get the item name
                    t.logItemUsage('Used item: ' + itemName);
                }
            });
        }

        // Add more logic here to detect other types of item usage (e.g., quantity changes)
    },

    logItemUsage: function(message) {
        var t = Tabs.ItemTracker;
        var timestamp = new Date().toLocaleString();
        var logEntry = '[' + timestamp + '] ' + message;
        t.itemLog.push(logEntry);
        t.updateItemLogDisplay();
        t.saveItemLog();
    },

    updateItemLogDisplay: function() {
        var t = Tabs.ItemTracker;
        var logDiv = ById('pbItemLog');
        logDiv.innerHTML = ''; // Clear existing log

        t.itemLog.forEach(function(logEntry) {
            var entryElement = document.createElement('div');
            entryElement.textContent = logEntry;
            logDiv.appendChild(entryElement);
        });

        logDiv.scrollTop = logDiv.scrollHeight; // Scroll to bottom
    },

    clearItemLog: function() {
        var t = Tabs.ItemTracker;
        t.itemLog = [];
        t.updateItemLogDisplay();
        t.saveItemLog();
    },

    loadItemLog: function() {
        var t = Tabs.ItemTracker;
        var storedLog = localStorage.getItem('pbItemLog');
        if (storedLog) {
            t.itemLog = JSON.parse(storedLog);
            t.updateItemLogDisplay();
        }
    },

    saveItemLog: function() {
        var t = Tabs.ItemTracker;
        localStorage.setItem('pbItemLog', JSON.stringify(t.itemLog));
    }
};