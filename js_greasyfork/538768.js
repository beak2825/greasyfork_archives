Tabs.Conquest = {
    tabOrder: 1000,
    tabLabel: 'Conquest',
    tabDisabled: false,
    myDiv: null,
    timer: null,
    options: { // Encapsulate options within the tab
        enabled: false,
        interval: 60 // Default interval in minutes
    },

    init: function(div) {
        var t = Tabs.Conquest;
        t.myDiv = div;

        // Load options from storage (if available)
        t.loadOptions();

        t.createUI();
    },

    createUI: function() {
        var t = Tabs.Conquest;
        var m = '<DIV class=divHeader align=center>' + tx('CONQUEST') + '</div>';

        m += '<div id="ConquestContent" style="padding:10px;">';
        m += '<table width="100%">';
        m += '<tr><td><INPUT id=btConquestEnabled type=checkbox ' + (t.options.enabled ? ' CHECKED' : '') + '> ' + tx('Enable Conquest') + '</td>';
        m += '<td>' + tx('Conquest Interval') + ': <INPUT id=btConquestInterval type=text size=3 value="' + t.options.interval + '"> ' + tx('minutes') + '</td></tr>';
        m += '</table>';

        m += '<hr>';
        m += '<div id="ConquestStatus"></div>';
        m += '<div id="ConquestLog" style="height:400px; overflow-y:auto;"></div>';
        m += '</div>';

        t.myDiv.innerHTML = m;

        // Add event listeners
        ById('btConquestEnabled').addEventListener('change', function() {
            t.options.enabled = this.checked;
            t.saveOptions();
            t.toggleConquest();
        }, false);

        ById('btConquestInterval').addEventListener('change', function() {
            var newInterval = parseInt(this.value);
            if (!isNaN(newInterval) && newInterval > 0) {
                t.options.interval = newInterval;
                t.saveOptions();
                t.resetConquestTimer(); // Reset the timer with the new interval
            } else {
                alert('Invalid interval. Please enter a positive number.');
                this.value = t.options.interval; // Revert to the previous value
            }
        }, false);

        t.toggleConquest(); // Initial toggle
    },

    loadOptions: function() {
        var t = Tabs.Conquest;
        // Load options from localStorage or similar mechanism
        // Example:
        var storedOptions = localStorage.getItem('ConquestOptions');
        if (storedOptions) {
            try {
                t.options = JSON.parse(storedOptions);
            } catch (e) {
                console.error('Error parsing Conquest options:', e);
            }
        }
    },

    saveOptions: function() {
        var t = Tabs.Conquest;
        // Save options to localStorage or similar mechanism
        // Example:
        localStorage.setItem('ConquestOptions', JSON.stringify(t.options));
    },

    toggleConquest: function() {
        var t = Tabs.Conquest;
        if (t.options.enabled) {
            t.start();
            ById('ConquestStatus').innerHTML = '<b>' + tx('Conquest is ACTIVE') + '</b>';
        } else {
            t.stop();
            ById('ConquestStatus').innerHTML = '<b>' + tx('Conquest is INACTIVE') + '</b>';
        }
    },

    start: function() {
        var t = Tabs.Conquest;
        if (t.timer == null) {
            t.timer = setInterval(t.doConquest.bind(t), t.options.interval * 60 * 1000); // Use bind to maintain the correct 'this' context
            t.doConquest(); // Run immediately
        }
    },

    stop: function() {
        var t = Tabs.Conquest;
        if (t.timer != null) {
            clearInterval(t.timer);
            t.timer = null;
        }
    },

    resetConquestTimer: function() {
        var t = Tabs.Conquest;
        t.stop(); // Stop the existing timer
        t.start(); // Start a new timer with the updated interval
    },

    doConquest: function() {
        var t = Tabs.Conquest;
        // Implement your conquest logic here
        // This function will be called every X minutes (based on the interval set)

        // For example:
        var log = ById('ConquestLog');
        if (log) {
            log.innerHTML += '<div>' + new Date().toLocaleString() + ': Conquest action performed</div>';
            log.scrollTop = log.scrollHeight;
        } else {
            console.error('ConquestLog element not found!');
        }
    },

    // Add more functions as needed for your conquest logic
};