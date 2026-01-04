// joust.js (Improved Joust Tab with Auto Event)

Tabs.Joust = {
    tabOrder: 2120,
    tabLabel: 'Joust',
    tabColor: 'brown',
    validJoust: false,
    isBusy: false,
    myDiv: null,
    timer: null,
    numJousts: 0,
    numWins: 0,
    autoJoustEnabled: false,
    joustDelay: 9, // Delay between jousts (in seconds)

    init(div) {
        this.myDiv = div;
        this.loadOptions();
        this.checkEvent();
    },

    loadOptions() {
        this.autoJoustEnabled = Options.JoustOptions ? Options.JoustOptions.autoJoustEnabled : false;
        this.joustDelay = Options.JoustOptions ? Options.JoustOptions.joustDelay : 9;
    },

    saveOptions() {
        Options.JoustOptions = Options.JoustOptions || {};
        Options.JoustOptions.autoJoustEnabled = this.autoJoustEnabled;
        Options.JoustOptions.joustDelay = this.joustDelay;
        saveOptions();
    },

    checkEvent() {
        this.validJoust = uW.cm.JoustingModel.getTimeLeft() > 0; // Check if jousting is active
        // Update tab style to indicate active/inactive joust
        // ...

        if (this.autoJoustEnabled && this.validJoust) {
            this.startJousting();
        }
    },

    async doJoust() {
        if (!this.isBusy || !this.validJoust) return; // Added check for validJoust

        const div = $("#pbjoust_info");

        try {
            const params = {
                ...uW.g_ajaxparams,
                ctrl: 'jousting\\JoustingController',
                action: 'opponents'
            };

            const result = await api.apiRequest("_dispatch53.php", params); // Use apiRequest
            if (!result.ok) {
                throw result.error; // Throw the error from apiRequest
            }

            // Joust with each opponent (with delay)
            result.opponents.forEach((opponent, index) => {
                setTimeout(async () => { // Use async here
                    await this.doFight(opponent.id, opponent.serverid);
                }, index * this.joustDelay * 1000);
            });

            // Schedule the next round of jousting (after all fights are done + random delay)
            const randomDelay = Math.floor(Math.random() * 4); // Random delay of 0-3 seconds
            setTimeout(() => this.nextJoust(), (result.opponents.length * this.joustDelay + randomDelay) * 1000); // Use opponents.length for correct delay

        } catch (error) {
            div.prepend(`<span style="color:#800;">${error.message}</span><br>`);
            this.handleError();
        }
    },

    async doFight(opponent, opponentServerId) {
        if (!this.isBusy || !this.validJoust) return; // Added check for validJoust

        const div = $("#pbjoust_info");

        try {
            const params = {
                ...uW.g_ajaxparams,
                ctrl: 'jousting\\JoustingController',
                action: 'fight',
                opponent,
                opponentServerId
            };

            const result = await api.apiRequest("_dispatch53.php", params);
            if (!result.ok) {
                throw result.error; // Throw the error from apiRequest
            }

            this.numJousts++;
            let reward = '';
            if (result.reward) {
                // ... (Handle reward) ...
                reward = ` - ${tx('Awarded')} ${result.reward.quantity} ${uW.itemlist['i' + result.reward.itemId].name}`;
            }

            if (result.report.s1.won) {
                this.numWins++;
                div.prepend(`<span style="color:#080;">${tx('Won against')} ${result.report.s0.nam}${reward}</span><br>`);
            } else {
                div.prepend(`<span style="color:#800;">${tx('Lost against')} ${result.report.s0.nam}${reward}</span><br>`);
            }

            $("#joustHeader").html(`${tx('Jousting Results')}... (${this.numWins}/${this.numJousts})`);

        } catch (error) {
            div.prepend(`<span style="color:#800;">${error.message}</span><br>`);
            this.handleError();
        }
    },

    // ... other functions (startJousting, nextJoust, setPopup, setCurtain, e_Cancel, show)
};


// Options tab (or where you initialize options)
if (!Options.JoustOptions) {
    Options.JoustOptions = {
        JoustRunning: false,
        JoustDelay: 9,
        autoJoustEnabled: false
    };
}

// Add a change option for JoustDelay
ChangeOption('JoustOptions', 'btjoustinterval', 'JoustDelay', function() {
    Tabs.Joust.joustDelay = Options.JoustOptions.JoustDelay;
    Tabs.Joust.saveOptions();
});