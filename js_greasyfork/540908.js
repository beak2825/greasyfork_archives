Tabs.MotdTab = {
    tabOrder: 8003,
    tabLabel: 'MOTD',
    tabColor: 'orange',
    myDiv: null,
    isInitialized: false,

    init: function(div) {
        var t = this;
        t.myDiv = div;
        t.myDiv.style.display = 'none';
        t.isInitialized = true;
        t.updateStatus('Ready to load MOTD');
    },

    paint: function() {
        var t = this;
        if (!t.isInitialized) {
            t.updateStatus('Please initialize first');
            return;
        }

        var m = `
            <div class="divHeader" align="center">Message of the Day</div>
            <div class="monitorContainer">
                <div id="motdStatus" class="statusMessage">Loading...</div>
                <div id="motdContent" style="margin-top:15px; white-space:pre-wrap;"></div>
            </div>
        `;

        t.myDiv.innerHTML = m;
        t.loadMotd();
    },

    show: function() {
        var t = this;
        t.myDiv.style.display = 'block';
        t.paint();
    },

    hide: function() {
        var t = this;
        t.myDiv.style.display = 'none';
        t.updateStatus('');
    },

    updateStatus: function(message) {
        var t = this;
        var statusEl = $("#motdStatus", t.myDiv);
        statusEl.html(message);
        statusEl.css({
            'color': message.includes('Error') ? '#dc3545' : '#28a745',
            'background-color': message.includes('Error') ? '#f8d7da' : '#d4edda'
        });
    },

    loadMotd: function() {
        var t = this;
        t.updateStatus('Loading...');
        $("#motdContent", t.myDiv).html('');
        $.ajax({
            url: 'https://www.rycamelot.com/fb/e2/src/ajax/getMotd.php',
            method: 'GET',
            dataType: 'text',
            success: function(data) {
                t.updateStatus('Loaded successfully');
                $("#motdContent", t.myDiv).html(data);
            },
            error: function(xhr, status, error) {
                t.updateStatus('Error: ' + error);
                $("#motdContent", t.myDiv).html('');
            }
        });
    }
};

// Register the tab with the game UI
(function() {
    function init() {
        var gameTabs = window.Tabs || (window.unsafeWindow && unsafeWindow.Tabs);
        if (gameTabs && gameTabs.addTab) {
            try {
                gameTabs.addTab(Tabs.MotdTab);
                var originalShowTab = gameTabs.showTab;
                gameTabs.showTab = function(tab) {
                    originalShowTab.apply(this, arguments);
                    if (tab === 'MotdTab') {
                        var tabDiv = document.getElementById('tab_MotdTab');
                        if (tabDiv) {
                            if (!Tabs.MotdTab.isInitialized) {
                                Tabs.MotdTab.init(tabDiv);
                            }
                            Tabs.MotdTab.paint();
                        }
                    }
                };
                return;
            } catch (e) {
                console.error('Error initializing MotdTab:', e);
            }
        }
        setTimeout(init, 500);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();