/*
Websocket wrapper class with WebSocket.IN api
*/

class WebSocketIn {
  constructor(channelId) {
    this.channelId = channelId;
    this.ws = null;
    this.connect();
  }

  connect() {
    const APIKEY = 'QipkWZUSG1D0KxYxHs3lp8vm6iTwa4Dv7xgG9PHpbQ56QmqKdaQVhi4DK1A8';
    const url = `ws:/172.16.0.217:1880/v3/${this.channelId}?apiKey=${APIKEY}`;
    this.ws = new WebSocket(url);
    console.log(`Connecting to: ${url}`);

    this.ws.onmessage = (event) => {
      this.onmessage(event);
    };

    this.ws.onopen = () => {
      console.log('Websocket connected!');
    };

    this.ws.onerror = (err) => {
      console.log(`Websocket error: ${err.message}`);
      this.ws.close();
    };

    this.ws.onclose = () => {
      console.log('Websocket closed!');
      setTimeout(() => {
        this.connect();
      }, 2500);
    };
  }

  onmessage(event) {
    console.log('parent');
    console.log(event.data);
  }

  send(data) {
    this.ws.send(data);
  }
}
