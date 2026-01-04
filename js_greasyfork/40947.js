bconfig = {
  maxBet: 0.0002200,
  wait: 1000,
  autoexit: 0.00001,
  want: 0.000014,
  toggleHilo:false,
  startbal: 0,
  won: 0,
};
hilo = 'hi';
multiplier = 1;
rollDice = function() {

  if ($('#double_your_btc_bet_lose').html() !== '') {
    $('#double_your_btc_2x').click();
    multiplier = 1;
    if(bconfig.toggleHilo)toggleHiLo();
  } else {
    $('#double_your_btc_min').click();
    multiplier = 1;
  }

  if (parseFloat($('#balance').html()) < (parseFloat($('#double_your_btc_stake').val()) * 2) ||
    parseFloat($('#double_your_btc_stake').val()) > bconfig.maxBet) {
    console.log($('#double_your_btc_min'));
  }
  if (parseFloat($('#balance').html()) < bconfig.autoexit) {
    throw "exit";
  }
  if (parseFloat($('#balance').html()) > bconfig.want) {
        var num = parseFloat($('#balance').html());
        bconfig.want = num + 0.00000030;
        bconfig.autoexit = num - 0.00000420;
  bconfig.won++;
  var total = num - bconfig.startbal;
        console.log('Setting bconfig want to: ' + bconfig.want)
        console.log('Setting autoexit to: ' + bconfig.autoexit)
  console.log('Total won: ' + total + ' BTC')
  }

  $('#double_your_btc_bet_hi_button').click();

  setTimeout(rollDice, (multiplier * bconfig.wait) + Math.round(Math.random() * 1000));
};

toggleHiLo = function() {
  if (hilo === 'hi') {
    hilo = 'hi';
  } else {
    hilo = 'hi';
  }
};
var num = parseFloat($('#balance').html());
bconfig.startbal = num;
bconfig.want = num + 0.00000030;
bconfig.autoexit = num - 0.00000420;
rollDice();
