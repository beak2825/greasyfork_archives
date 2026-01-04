// AMQ Player Answer Times Utility
// version 1.4
// this script is fetched automatically, do not attempt to add it to tampermonkey

const amqAnswerTimesUtility = new function() {
    "use strict"
    this.songStartTime = 0
    this.playerTimes = []
    if (typeof(Listener) === "undefined") {
        return
    }
    new Listener("play next song", () => {
        this.songStartTime = Date.now()
        this.playerTimes = []
    }).bindListener()
    
    new Listener("player answered", (data) => {
        const time = Date.now() - this.songStartTime
        data.forEach(gamePlayerId => {
            this.playerTimes[gamePlayerId] = time
        })
    }).bindListener()
    
    new Listener("Join Game", (data) => {
        const quizState = data.quizState
        if (quizState) {
            this.songStartTime = Date.now() - quizState.songTimer * 1000
        }
    }).bindListener()

    new Listener("Spectate Game", (data) => {
        const quizState = data.quizState
        if (quizState) {
            this.songStartTime = Date.now() - quizState.songTimer * 1000
        }
    }).bindListener()
}()
