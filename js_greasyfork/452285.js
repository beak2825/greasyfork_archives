class AnkiConnect {
  baseURL;
  version;

  constructor(baseURL = 'http://localhost:8765', version = 6) {
    this.baseURL = baseURL;
    this.version = version;
  }

  async send(action, params, version = this.version) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('error', () => reject('failed to issue request'));
      xhr.addEventListener('load', () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (Object.getOwnPropertyNames(response).length != 2) {
            throw 'response has an unexpected number of fields';
          }
          if (!response.hasOwnProperty('error')) {
            throw 'response is missing required error field';
          }
          if (!response.hasOwnProperty('result')) {
            throw 'response is missing required result field';
          }
          if (response.error) {
            throw response.error;
          }
          resolve(response.result);
        } catch (e) {
          reject(e);
        }
      });

      xhr.open('POST', this.baseURL);
      xhr.send(JSON.stringify({ action, version, params }));
    });
  }

  chain(action, params, version = this.version) {
    const actions = [{ action, params }];

    const chainable = {
      commit: async () => {
        if (actions.length > 1) {
          return this.send('multi', { actions }, version);
        }

        return this.send(action, params, version);
      },
      add: async (action, params) => {
        actions.push({ action, params });
        return chainable;
      },
    };

    return chainable;
  }
}
