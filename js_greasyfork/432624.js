var data_month = ([
    ['2021/12', 15, 9.36],
    ['2022/01', 15, 15.8],
    ['2022/02', 15, 13.86],
    ['2022/03', 15, 0],
    ['2022/04', 15, 0],
    ['2022/05', 15, 9.36],
    ['2022/06', 15, 18.98],
    ['2022/07', 15, 9.22],
    ['2022/08', 15, 2.22],
    ['2022/09', 15, 5],
    ['2022/10', 15, 16.24],
    ['2022/11', 15, 2.22],
]);

var date = '04/11/2022'

var detailData = {
    '2020/01': [
        { 'dat': '2020-01-28', 'inc': 9.36, 'who': 'Christiane G', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2020/02': [
        { 'dat': '2020-02-11', 'inc': 9.36, 'who': 'Christiane G', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2020/03': [
        { 'dat': '2020-03-01', 'inc': 4.5, 'who': 'Kornelia M', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-03-14', 'inc': 9.36, 'who': 'etienne1306', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-03-15', 'inc': 5.5, 'who': 'Max P', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-03-16', 'inc': 9.36, 'who': 'Doris H', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-03-19', 'inc': 5.04, 'who': 'Annette H', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-03-19', 'inc': 9.36, 'who': 'Christiane g', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-03-24', 'inc': 9.16, 'who': 'Ines L', 'pays': ['CH', 'Suisse', 'Swiss'] },
        { 'dat': '2020-03-24', 'inc': 9.36, 'who': 'Andreas A', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2020/04': [
        { 'dat': '2020-04-12', 'inc': 4.5, 'who': 'Kallerberg', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-04-30', 'inc': 4.5, 'who': 'Antonio-Acuña B', 'pays': ['ES', 'Espagne', 'Spain'] },
    ], '2020/05': [
        { 'dat': '2020-05-15', 'inc': 9.36, 'who': 'Andreas S', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-05-27', 'inc': 19.07, 'who': 'kanokwan s', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2020/06': [
        { 'dat': '2020-06-10', 'inc': 4.5, 'who': 'Swen A', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2020/07': [
        { 'dat': '2020-07-06', 'inc': 4.5, 'who': 'Raul-Garcia C', 'pays': ['ES', 'Espagne', 'Spain'] },
        { 'dat': '2020-07-17', 'inc': 47.2, 'who': 'Nepomuk P', 'pays': ['CH', 'Suisse', 'Swiss'] },
    ], '2020/08': [
    ], '2020/09': [
        { 'dat': '2020-09-07', 'inc': 9.36, 'who': 'Christian P', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-09-07', 'inc': 9.36, 'who': 'Christiane G', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2020/10': [
        { 'dat': '2020-10-02', 'inc': 9.16, 'who': 'Ines L', 'pays': ['CH', 'Suisse', 'Swiss'] },
        { 'dat': '2020-10-24', 'inc': 9.16, 'who': 'Eric A', 'pays': ['TG', 'Togo', 'Togo'] },
    ], '2020/11': [
        { 'dat': '2020-11-17', 'inc': 2.08, 'who': 'Martin G', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-11-25', 'inc': 1.59, 'who': 'Marie-Laure D', 'pays': ['FR', 'France', 'France'] },
    ], '2020/12': [
        { 'dat': '2020-12-01', 'inc': 5.04, 'who': 'Susi K', 'pays': ['EE', 'Estonie', 'Estonia'] },
        { 'dat': '2020-12-01', 'inc': 9.36, 'who': 'Ulla R', 'pays': ['SE', 'Suède', 'Sweden'] },
        { 'dat': '2020-12-02', 'inc': 19.07, 'who': 'Christiane G', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2020-12-24', 'inc': 4.5, 'who': 'Mateusz O', 'pays': ['PL', 'Pologne', 'Poland'] },
    ], '2021/01': [
        { 'dat': '2021-01-21', 'inc': 9.36, 'who': 'Jean-Paul B', 'pays': ['FR', 'France', 'France'] },
    ], '2021/02': [
        { 'dat': '2021-02-04', 'inc': 19.07, 'who': 'Artur Z', 'pays': ['PL', 'Pologne', 'Poland'] },
    ], '2021/03': [
        { 'dat': '2021-03-06', 'inc': 4.4, 'who': 'Therese S', 'pays': ['CZ', 'Tchéquie', 'Czechia'] },
        { 'dat': '2021-03-18', 'inc': 9.16, 'who': 'Eli M', 'pays': ['AU', 'Australie', 'Australia'] },
        { 'dat': '2021-03-22', 'inc': 19.07, 'who': 'Sven K', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2021-03-28', 'inc': 9.36, 'who': 'Uwe J', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2021-03-31', 'inc': 9.16, 'who': 'Eli M', 'pays': ['AU', 'Australie', 'Australia'] },
    ], '2021/04': [
    ], '2021/05': [
        { 'dat': '2021-05-03', 'inc': 19.07, 'who': 'Elwira G', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2021/06': [
        { 'dat': '2021-06-28', 'inc': 4.5, 'who': 'Thomas C', 'pays': ['GB', 'Royaume-Uni', 'United Kingdom'] },
    ], '2021/07': [
    ], '2021/08': [
        { 'dat': '2021-08-19', 'inc': 4.5, 'who': 'Denai', 'pays': ['AT', 'Autriche', 'Austria'] },
        { 'dat': '2021-08-20', 'inc': 9.36, 'who': 'Herbert L', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2021-08-20', 'inc': 9.16, 'who': 'elifoxo', 'pays': ['AU', 'Australie', 'Australia'] },
    ], '2021/09': [
    ], '2021/10': [
        { 'dat': '2021-10-18', 'inc': 4.5, 'who': 'Petr M', 'pays': ['CZ', 'Tchéquie', 'Czechia'] },
        { 'dat': '2021-10-31', 'inc': 4.5, 'who': 'Detlef Z', 'pays': ['DE', 'Allemagne', 'Germany'] },
    ], '2021/11': [
        { 'dat': '2021-11-02', 'inc': 4.5, 'who': 'Societatea-d-S B', 'pays': ['RO', 'Roumanie', 'Romania'] },
        { 'dat': '2021-11-03', 'inc': 14.21, 'who': 'Attila', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2021-11-05', 'inc': 0.38, 'who': 'Francesco L', 'pays': ['IT', 'Italie', 'Italy'] },
        { 'dat': '2021-11-05', 'inc': 28.78, 'who': 'glaglatoulle', 'pays': ['FR', 'France', 'France'] },
        { 'dat': '2021-11-05', 'inc': 4.5, 'who': 'Comte M', 'pays': ['FR', 'France', 'France'] },
        { 'dat': '2021-11-13', 'inc': 4.5, 'who': 'Sven O', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2021-11-27', 'inc': 9.36, 'who': 'Ocaso', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2021-11-30', 'inc': 0.62, 'who': 'Gyorgy C', 'pays': ['NL', 'Pays-Bas', 'Netherlands'] },
    ], '2021/12': [
        { 'dat': '2021-12-29', 'inc': 9.36, 'who': 'SABINE B', 'pays': ['FR', 'France', 'France'] },
    ], '2022/01': [
        { 'dat': '2022-01-05', 'inc': 4.5, 'who': 'Diana S', 'pays': ['DE', 'Allemagne', 'Germany'] },
        { 'dat': '2022-01-11', 'inc': 11.3, 'who': 'Ulla R', 'pays': ['SE', 'Suède', 'Sweden'] },
    ], '2022/02': [
        { 'dat': '2022-02-22', 'inc': 4.5, 'who': 'José-Miguel A', 'pays': ['ES', 'Espagne', 'Spain'] },
        { 'dat': '2022-02-28', 'inc': 9.36, 'who': 'benoit A', 'pays': ['FR', 'France', 'France'] },
    ], '2022/03': [
    ], '2022/04': [
    ], '2022/05': [
        { 'dat': '2022-05-06', 'inc': 9.36, 'who': 'filippo v', 'pays': ['IT', 'Italie', 'Italy'] },
    ], '2022/06': [
        { 'dat': '2022-06-01', 'inc': 9.36, 'who': 'Gabory A', 'pays': ['FR', 'France', 'France'] },
        { 'dat': '2022-06-01', 'inc': 4.5, 'who': 'Dorthe D', 'pays': ['NL', 'Pays-Bas', 'Netherlands'] },
        { 'dat': '2022-06-21', 'inc': 0.62, 'who': 'Gyorgy C', 'pays': ['NL', 'Pays-Bas', 'Netherlands'] },
        { 'dat': '2022-06-29', 'inc': 4.5, 'who': 'Dylan D', 'pays': ['FR', 'France', 'France'] },
    ], '2022/07': [
        { 'dat': '2022-07-04', 'inc': 2.22, 'who': 'adriano g', 'pays': ['IT', 'Italie', 'Italy'] },
        { 'dat': '2022-07-14', 'inc': 1, 'who': 'Gyorgy C', 'pays': ['NL', 'Pays-Bas', 'Netherlands'] },
        { 'dat': '2022-07-16', 'inc': 1, 'who': 'Eduard B', 'pays': ['TR', 'Turquie', ''] },
        { 'dat': '2022-07-27', 'inc': 5, 'who': 'Arphox', 'pays': ['HU', 'Hongrie', 'Hungary'] },
    ], '2022/08': [
        { 'dat': '2022-08-04', 'inc': 2.22, 'who': 'adriano g', 'pays': ['IT', 'Italie', 'Italy'] },
    ], '2022/09': [
        { 'dat': '2022-09-12', 'inc': 5, 'who': 'Laurent R', 'pays': ['FR', 'France', 'France'] },
    ], '2022/10': [
        { 'dat': '2022-10-04', 'inc': 2.22, 'who': 'adriano g', 'pays': ['IT', 'Italie', 'Italy'] },
        { 'dat': '2022-10-23', 'inc': 14.02, 'who': 'Davryll', 'pays': ['GB', 'Royaume-Uni', 'United Kingdom'] },
    ], '2022/11': [
        { 'dat': '2022-11-04', 'inc': 2.22, 'who': 'adriano g', 'pays': ['IT', 'Italie', 'Italy'] },
    ],
};
