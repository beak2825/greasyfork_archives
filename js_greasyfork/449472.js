// ==UserScript==
// @name        $Boolean
// @author      Callum Latham <callumtylerlatham@gmail.com>
// @exclude     *
// @description Handles persistent storage of boolean values.
// ==/UserScript==

class $Boolean {
    constructor(KEY, DEFAULT = true) {
        // PRIVATE STATE

        let value;

        // PRIVATE FUNCTIONS

        const getError = (message, error) => {
            if (error) {
                console.error(error);
            }

            return new Error(`[$Toggle] ${message}`);
        };

        const set = (_value) => {
            value = _value;

            if (typeof GM.setValue !== 'function') {
                return Promise.reject(getError('The GM.setValue permission is required to store data.'));
            }

            return GM.setValue(KEY, value);
        };

        // PUBLIC FUNCTIONS

        this.init = () => {
            if (typeof GM.getValue !== 'function') {
                return Promise.reject(getError('The GM.getValue permission is required to retrieve data.'));
            }

            return GM.getValue(KEY, DEFAULT)
                .then(set);
        };

        this.toggle = () => set(!value);

        this.get = () => value;
    };
}
