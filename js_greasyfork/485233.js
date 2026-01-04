const defaultRate = 7.1;
const defaultShippingCost = 85;

function getPrice(cost, weight) {
  let proRate = 0.25;
  if (cost <= 250 && cost > 50) {
    proRate = 0.22;
  }
  const rate = getRate() * 0.944 * 0.99;
  const shippingCost = +getShippingCost();
  const price = ((cost + weight * shippingCost) / (1 - proRate)) / rate;
  return Math.ceil(price);
}