// ==UserScript==
// @name         OneHundredNotes MIDI Input Player
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Plays back MIDI events from some sort of MIDI player (like MIDI-OX or nanoMIDIPlayer)
// @author       zackiboiz
// @match        *://onehundrednotes.vercel.app/*
// @icon         https://icons.duckduckgo.com/ip2/vercel.app.ico
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/socket.io@4.8.1/client-dist/socket.io.min.js
// @downloadURL https://update.greasyfork.org/scripts/529872/OneHundredNotes%20MIDI%20Input%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/529872/OneHundredNotes%20MIDI%20Input%20Player.meta.js
// ==/UserScript==

class MIDIController {
    constructor(socket) {
        this.socket = socket;
        this.sustain = false;
        this.auto_sustain = false;
        this.sustained_notes = {};
    }

    pressSustain() {
        this.sustain = true;
    }

    releaseSustain() {
        this.sustain = false;
        if (!this.auto_sustain) {
            for (const [name, note] of Object.entries(this.sustained_notes)) {
                if (this.sustained_notes[name] && !this.held_notes[name]) {
                    this.releaseNote(note.name, note.channel, null, true);
                    this.sustained_notes[name] = false;
                }
            }
        }
    }

    setupMIDIEvents() {
        console.log("[DEBUG] Requesting MIDI access...");
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then((res) => {
                console.log("[DEBUG] MIDI access granted.");
                res.inputs.forEach((input) => {
                    input.onmidimessage = this.handleMIDIMessage.bind(this);
                });
            }).catch(() => {
                console.log("[DEBUG] MIDI access denied.");
            });
        }
    }

    handleMIDIMessage(message) {
        const [status, note_num, velocity] = message.data;
        const channel = status & 0x0f;

        if (status >= 0x90 && status <= 0x9f && velocity > 0) {
            const { note, octave } = this.getNoteName(note_num + 9);
            this.pressNote(note, octave);
        } else if ((status >= 0x80 && status <= 0x8f) || (status >= 0x90 && status <= 0x9f && velocity === 0)) {
            const { note, octave } = this.getNoteName(note_num + 9);
            this.releaseNote(note, octave);
        } else if (status >= 0xb0 && status <= 0xbf && note_num === 64) {
            if (velocity > 0) {
                this.pressSustain();
            } else {
                this.releaseSustain();
            }
        }
    }

    getNoteName(midi_note) {
        const steps = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const octave = Math.floor((midi_note - 21) / 12);
        const note = steps[(midi_note - 21) % 12];
        return { note, octave };
    }

    pressNote(note, octave) {
        console.log(`[DEBUG] Pressing ${note + octave}.`);
        this.socket.emit("note-start", {
            letter: note,
            octave: octave
        });
    }

    releaseNote(note, octave) {
        console.log(`[DEBUG] Releasing ${note + octave}.`);
        this.socket.emit("note-stop", {
            letter: note,
            octave: octave
        });
    }
}

const socket = window.io("https://onehundrednotes.onrender.com", {
    origin: "https://onehundrednotes.vercel.app",
    autoConnect: false,
});
socket.on("connect", () => {
    console.log("[DEBUG] Connected to OneHundredNotes.com socket.");

    const controller = new MIDIController(socket);
    controller.setupMIDIEvents();
});

socket.connect();
console.log("[DEBUG] OneHundredNotes.com MIDI Input Player connected.");